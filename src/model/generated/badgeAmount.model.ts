import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, Index as Index_} from "@subsquid/typeorm-store"
import {BadgeHolder} from "./badgeHolder.model"

@Entity_()
export class BadgeAmount {
    constructor(props?: Partial<BadgeAmount>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    badgeId!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @Index_()
    @ManyToOne_(() => BadgeHolder, {nullable: true})
    holder!: BadgeHolder
}
