import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, JSONColumn as JSONColumn_, OneToMany as OneToMany_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {BadgeAmount} from "./badgeAmount.model"

@Entity_()
export class BadgeHolder {
    constructor(props?: Partial<BadgeHolder>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @JSONColumn_({nullable: false})
    holdings!: unknown

    @OneToMany_(() => BadgeAmount, e => e.holder)
    badgesHeld!: BadgeAmount[]

    @BigIntColumn_({nullable: false})
    totalAmount!: bigint
}
