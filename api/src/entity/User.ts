import * as bcrypt from "bcryptjs";
import {
Column,
CreateDateColumn,
Entity,
JoinTable,
ManyToMany,
ManyToOne,
OneToMany,
PrimaryGeneratedColumn,
Unique,
UpdateDateColumn,
} from "typeorm";
import { Ticket } from "./Ticket";

@Entity()
@Unique(["username"])
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @Column()
  public email: string;

  @Column()
  public isAdmin: boolean;

  @Column({select: false})
  public password: string;

  @Column({select: false, nullable: true})
  public passwordResetToken: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  public hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      if (unencryptedPassword) {
          return bcrypt.compareSync(unencryptedPassword, this.password);
      } else {
          return false;
      }
  }
}
