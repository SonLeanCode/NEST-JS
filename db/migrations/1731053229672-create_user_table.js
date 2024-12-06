"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserTable1731053229672 = void 0;
class CreateUserTable1731053229672 {
    constructor() {
        this.name = 'CreateUserTable1731053229672';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`frist_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`status\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`user\``);
    }
}
exports.CreateUserTable1731053229672 = CreateUserTable1731053229672;
//# sourceMappingURL=1731053229672-create_user_table.js.map