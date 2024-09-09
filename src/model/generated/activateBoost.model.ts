import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class ActivateBoost {
    constructor(props?: Partial<ActivateBoost>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    user!: string

    @StringColumn_({nullable: false})
    validator!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @DateTimeColumn_({nullable: false})
    timestamp!: Date
}
