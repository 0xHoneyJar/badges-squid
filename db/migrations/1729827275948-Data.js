module.exports = class Data1729827275948 {
    name = 'Data1729827275948'

    async up(db) {
        await db.query(`CREATE TABLE "badge_amount" ("id" character varying NOT NULL, "badge_id" text NOT NULL, "amount" numeric NOT NULL, "holder_id" character varying, CONSTRAINT "PK_1f16967256b40dcb9b88223db11" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_3aafc2a5bd1365f6b62c0465e2" ON "badge_amount" ("holder_id") `)
        await db.query(`CREATE TABLE "beraname" ("id" character varying NOT NULL, "name" text NOT NULL, "whois" text NOT NULL, "expiry" numeric NOT NULL, "metadata_uri" text NOT NULL, "owner_id" character varying, CONSTRAINT "PK_8e7112f6ac523e7fbd039d967ec" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b0689de32772d45a2784438956" ON "beraname" ("owner_id") `)
        await db.query(`CREATE TABLE "badge_holder" ("id" character varying NOT NULL, "holdings" jsonb NOT NULL, "total_amount" numeric NOT NULL, CONSTRAINT "PK_48f93fa9ddf32f955915e8d3d59" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "queue_boost" ("id" character varying NOT NULL, "user" text NOT NULL, "validator" text NOT NULL, "amount" numeric NOT NULL, "timestamp" numeric NOT NULL, "block_number" numeric NOT NULL, CONSTRAINT "PK_142c0a759b268f51e65ae4cf259" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "activate_boost" ("id" character varying NOT NULL, "user" text NOT NULL, "validator" text NOT NULL, "amount" numeric NOT NULL, "timestamp" numeric NOT NULL, "block_number" numeric NOT NULL, CONSTRAINT "PK_28f77a8f01839832c318ad5ddaa" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "cancel_boost" ("id" character varying NOT NULL, "user" text NOT NULL, "validator" text NOT NULL, "amount" numeric NOT NULL, "timestamp" numeric NOT NULL, "block_number" numeric NOT NULL, CONSTRAINT "PK_fafeb2de8cc3c42d3b939afe0d8" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "drop_boost" ("id" character varying NOT NULL, "user" text NOT NULL, "validator" text NOT NULL, "amount" numeric NOT NULL, "timestamp" numeric NOT NULL, "block_number" numeric NOT NULL, CONSTRAINT "PK_3799cfd4dd09d95e2f0383cf489" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "distribution_reward" ("id" character varying NOT NULL, "token" text NOT NULL, "amount" numeric NOT NULL, "block_number" numeric NOT NULL, "distribution_id" character varying, CONSTRAINT "PK_0793c39ce09f062b7cacdcf1f33" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_c6e9f6f8ed99541faf96b31eaa" ON "distribution_reward" ("distribution_id") `)
        await db.query(`CREATE TABLE "distribution" ("id" character varying NOT NULL, "val_coinbase" text NOT NULL, "block_number" numeric NOT NULL, "receiver" text NOT NULL, "amount" numeric NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_187eaf203ccf9018df51b40108c" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "block" ("id" character varying NOT NULL, "number" numeric NOT NULL, "timestamp" numeric NOT NULL, "hash" text NOT NULL, "parent_hash" text NOT NULL, CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "badge_amount" ADD CONSTRAINT "FK_3aafc2a5bd1365f6b62c0465e2c" FOREIGN KEY ("holder_id") REFERENCES "badge_holder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "beraname" ADD CONSTRAINT "FK_b0689de32772d45a2784438956c" FOREIGN KEY ("owner_id") REFERENCES "badge_holder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "distribution_reward" ADD CONSTRAINT "FK_c6e9f6f8ed99541faf96b31eaa3" FOREIGN KEY ("distribution_id") REFERENCES "distribution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "badge_amount"`)
        await db.query(`DROP INDEX "public"."IDX_3aafc2a5bd1365f6b62c0465e2"`)
        await db.query(`DROP TABLE "beraname"`)
        await db.query(`DROP INDEX "public"."IDX_b0689de32772d45a2784438956"`)
        await db.query(`DROP TABLE "badge_holder"`)
        await db.query(`DROP TABLE "queue_boost"`)
        await db.query(`DROP TABLE "activate_boost"`)
        await db.query(`DROP TABLE "cancel_boost"`)
        await db.query(`DROP TABLE "drop_boost"`)
        await db.query(`DROP TABLE "distribution_reward"`)
        await db.query(`DROP INDEX "public"."IDX_c6e9f6f8ed99541faf96b31eaa"`)
        await db.query(`DROP TABLE "distribution"`)
        await db.query(`DROP TABLE "block"`)
        await db.query(`ALTER TABLE "badge_amount" DROP CONSTRAINT "FK_3aafc2a5bd1365f6b62c0465e2c"`)
        await db.query(`ALTER TABLE "beraname" DROP CONSTRAINT "FK_b0689de32772d45a2784438956c"`)
        await db.query(`ALTER TABLE "distribution_reward" DROP CONSTRAINT "FK_c6e9f6f8ed99541faf96b31eaa3"`)
    }
}
