import * as bcrypt from "bcryptjs";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from "typeorm";

@Entity()
@Unique(["email"])
export class Admin {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public email: string;

  @Column({ select: false })
  public password: string;

  @Column({ select: false, nullable: true })
  public passwordResetToken: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  public hashPassword(): void {
      this.password = bcrypt.hashSync(this.password, 8);
  }

  public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
      if (unencryptedPassword) {
          return bcrypt.compareSync(unencryptedPassword, this.password);
      }
      return false;
  }
}
