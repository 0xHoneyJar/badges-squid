import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {DistributionReward} from "./distributionReward.model"

@Entity_()
export class Distribution {
    constructor(props?: Partial<Distribution>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    valCoinbase!: string

    @BigIntColumn_({nullable: false})
    blockNumber!: bigint

    @StringColumn_({nullable: false})
    receiver!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: false})
    timestamp!: bigint

    @OneToMany_(() => DistributionReward, e => e.distribution)
    rewards!: DistributionReward[]
}
