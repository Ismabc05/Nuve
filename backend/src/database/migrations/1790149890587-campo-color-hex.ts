import { MigrationInterface, QueryRunner } from "typeorm";

export class CampoColorHex1790149890587 implements MigrationInterface {
    name = 'CampoColorHex1790149890587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product-variants" ADD "colorHex" character varying(7) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "total" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "total" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "product-variants" DROP COLUMN "colorHex"`);
    }

}
