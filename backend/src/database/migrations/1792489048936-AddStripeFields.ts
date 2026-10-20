import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStripeFields1792489048936 implements MigrationInterface {
    name = 'AddStripeFields1792489048936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "stripeSessionId" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "paid" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "total" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "total" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "paid"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "stripeSessionId"`);
    }

}
