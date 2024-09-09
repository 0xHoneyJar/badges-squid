import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, JSONColumn as JSONColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class BadgeHolder {
    constructor(props?: Partial<BadgeHolder>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @JSONColumn_({nullable: false})
    holdings!: unknown
}
