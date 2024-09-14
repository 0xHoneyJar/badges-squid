module.exports = class Data1725918407770 {
    name = 'Data1725918407770'

    async up(db) {
        await db.query(`CREATE TABLE "badge_holder" ("id" character varying NOT NULL, "holdings" jsonb NOT NULL, CONSTRAINT "PK_48f93fa9ddf32f955915e8d3d59" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "queue_boost" ("id" character varying NOT NULL, "user" text NOT NULL, "validator" text NOT NULL, "amount" numeric NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_142c0a759b268f51e65ae4cf259" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "activate_boost" ("id" character varying NOT NULL, "user" text NOT NULL, "validator" text NOT NULL, "amount" numeric NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_28f77a8f01839832c318ad5ddaa" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "badge_holder"`)
        await db.query(`DROP TABLE "queue_boost"`)
        await db.query(`DROP TABLE "activate_boost"`)
    }
}
