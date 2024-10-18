import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {BadgeHolder} from "./badgeHolder.model"

@Entity_()
export class Beraname {
    constructor(props?: Partial<Beraname>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    name!: string

    @Index_()
    @ManyToOne_(() => BadgeHolder, {nullable: true})
    owner!: BadgeHolder

    @StringColumn_({nullable: false})
    whois!: string

    @BigIntColumn_({nullable: false})
    expiry!: bigint

    @StringColumn_({nullable: false})
    metadataURI!: string
}
