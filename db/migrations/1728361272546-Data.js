module.exports = class Data1728361272546 {
    name = 'Data1728361272546'

    async up(db) {
        await db.query(`CREATE TABLE "badge_amount" ("id" character varying NOT NULL, "badge_id" text NOT NULL, "amount" numeric NOT NULL, "holder_id" character varying, CONSTRAINT "PK_1f16967256b40dcb9b88223db11" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_3aafc2a5bd1365f6b62c0465e2" ON "badge_amount" ("holder_id") `)
        await db.query(`CREATE TABLE "badge_holder" ("id" character varying NOT NULL, "holdings" jsonb NOT NULL, "total_amount" numeric NOT NULL, CONSTRAINT "PK_48f93fa9ddf32f955915e8d3d59" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "queue_boost" ("id" character varying NOT NULL, "user" text NOT NULL, "validator" text NOT NULL, "amount" numeric NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_142c0a759b268f51e65ae4cf259" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "activate_boost" ("id" character varying NOT NULL, "user" text NOT NULL, "validator" text NOT NULL, "amount" numeric NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_28f77a8f01839832c318ad5ddaa" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "badge_amount" ADD CONSTRAINT "FK_3aafc2a5bd1365f6b62c0465e2c" FOREIGN KEY ("holder_id") REFERENCES "badge_holder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "badge_amount"`)
        await db.query(`DROP INDEX "public"."IDX_3aafc2a5bd1365f6b62c0465e2"`)
        await db.query(`DROP TABLE "badge_holder"`)
        await db.query(`DROP TABLE "queue_boost"`)
        await db.query(`DROP TABLE "activate_boost"`)
        await db.query(`ALTER TABLE "badge_amount" DROP CONSTRAINT "FK_3aafc2a5bd1365f6b62c0465e2c"`)
    }
}
