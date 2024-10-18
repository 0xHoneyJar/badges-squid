import { Arg, Field, Int, ObjectType, Query, Resolver } from "type-graphql";
import type { EntityManager } from "typeorm";
import { BadgeAmount } from "../../model";

@ObjectType()
class BadgeHolderCount {
  @Field()
  badgeId!: string;

  @Field(() => Int)
  holderCount!: number;
}

@ObjectType()
class TotalUniqueHolders {
  @Field(() => [String])
  badgeIds!: string[];

  @Field(() => Int)
  holderCount!: number;
}

@Resolver()
export class BadgeStatsResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [BadgeHolderCount])
  async badgeHolderCounts(
    @Arg("badgeIds", () => [String], { nullable: true }) badgeIds?: string[]
  ): Promise<BadgeHolderCount[]> {
    const manager = await this.tx();
    const query = manager
      .getRepository(BadgeAmount)
      .createQueryBuilder("badgeAmount")
      .select("badgeAmount.badgeId", "badgeId")
      .addSelect("COUNT(DISTINCT badgeAmount.holder)", "holderCount")
      .groupBy("badgeAmount.badgeId");

    if (badgeIds && badgeIds.length > 0) {
      query.where("badgeAmount.badgeId IN (:...badgeIds)", { badgeIds });
    }

    const result = await query.getRawMany();

    return result.map((row) => ({
      badgeId: row.badgeId,
      holderCount: parseInt(row.holderCount),
    }));
  }

  @Query(() => BadgeHolderCount, { nullable: true })
  async badgeHolderCount(
    @Arg("badgeId") badgeId: string
  ): Promise<BadgeHolderCount | null> {
    const manager = await this.tx();
    const result = await manager
      .getRepository(BadgeAmount)
      .createQueryBuilder("badgeAmount")
      .select("COUNT(DISTINCT badgeAmount.holder)", "holderCount")
      .where("badgeAmount.badgeId = :badgeId", { badgeId })
      .getRawOne();

    return result
      ? { badgeId, holderCount: parseInt(result.holderCount) }
      : null;
  }

  @Query(() => TotalUniqueHolders)
  async totalUniqueHoldersForBadges(
    @Arg("badgeIds", () => [String]) badgeIds: string[]
  ): Promise<TotalUniqueHolders> {
    const manager = await this.tx();
    const result = await manager
      .getRepository(BadgeAmount)
      .createQueryBuilder("badgeAmount")
      .select("COUNT(DISTINCT badgeAmount.holder)", "holderCount")
      .where("badgeAmount.badgeId IN (:...badgeIds)", { badgeIds })
      .getRawOne();

    return {
      badgeIds,
      holderCount: parseInt(result.holderCount),
    };
  }
}
