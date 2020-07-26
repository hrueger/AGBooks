import {
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id: number;
}
