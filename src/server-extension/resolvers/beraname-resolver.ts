import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import type { EntityManager } from "typeorm";
import { Beraname } from "../../model";

@ObjectType()
class BeranameInfo {
  @Field()
  address!: string;

  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field(() => String, { nullable: true })
  whois!: string | null;
}

@Resolver()
export class BeranameResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [BeranameInfo])
  async getBeranamesByAddresses(
    @Arg("addresses", () => [String]) addresses: string[]
  ): Promise<BeranameInfo[]> {
    const manager = await this.tx();

    // Get all beranames where owner.id is in the addresses array
    const beranames = await manager
      .getRepository(Beraname)
      .createQueryBuilder("beraname")
      .leftJoinAndSelect("beraname.owner", "owner")
      .where("LOWER(owner.id) IN (:...addresses)", {
        addresses: addresses.map((a) => a.toLowerCase()),
      })
      .getMany();

    // Create a map of address -> beraname for easy lookup
    const beranameMap = new Map<string, Beraname>();
    for (const beraname of beranames) {
      if (beraname.owner) {
        beranameMap.set(beraname.owner.id.toLowerCase(), beraname);
      }
    }

    // Return results for all requested addresses, even if no beraname found
    return addresses.map((address) => {
      const beraname = beranameMap.get(address.toLowerCase());
      return {
        address: address.toLowerCase(),
        name: beraname?.name || null,
        whois: beraname?.whois || null,
      };
    });
  }
}
