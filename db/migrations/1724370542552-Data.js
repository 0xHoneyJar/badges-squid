module.exports = class Data1724370542552 {
    name = 'Data1724370542552'

    async up(db) {
        await db.query(`CREATE TABLE "badge_holder" ("id" character varying NOT NULL, "holdings" jsonb NOT NULL, CONSTRAINT "PK_48f93fa9ddf32f955915e8d3d59" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "badge_holder"`)
    }
}
