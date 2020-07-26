import { getRepository, MigrationInterface } from "typeorm";
import { Admin } from "../entity/Admin";

// tslint:disable-next-line: class-name
export class createAdminUser1574018391679 implements MigrationInterface {
    public async up(): Promise<any> {
        const user = new Admin();
        user.email = "admin@agbooks.com";
        user.password = "admin";
        user.hashPassword();
        const userRepository = getRepository(Admin);
        await userRepository.save(user);
    }

    public async down(): Promise<any> {
        //
    }
}
