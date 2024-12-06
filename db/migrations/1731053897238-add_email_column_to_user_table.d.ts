import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddEmailColumnToUserTable1731053897238 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
