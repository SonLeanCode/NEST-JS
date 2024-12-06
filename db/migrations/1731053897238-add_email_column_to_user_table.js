"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddEmailColumnToUserTable1731053897238 = void 0;
class AddEmailColumnToUserTable1731053897238 {
    constructor() {
        this.name = 'AddEmailColumnToUserTable1731053897238';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    }
}
exports.AddEmailColumnToUserTable1731053897238 = AddEmailColumnToUserTable1731053897238;
//# sourceMappingURL=1731053897238-add_email_column_to_user_table.js.map