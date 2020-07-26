import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import { Admin } from "../entity/Admin";

// tslint:disable-next-line: class-name
export class createAdminUser1574018391679 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const user = new Admin();
        user.email = "admin@agbooks.com";
        user.password = "admin";
        user.hashPassword();
        const userRepository = getRepository(Admin);
        await userRepository.save(user);
    }

    // tslint:disable-next-line: no-empty
    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
