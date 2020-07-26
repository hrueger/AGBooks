import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public guid: string;

    @Column()
    public name: string;

    @Column()
    @CreateDateColumn()
    public createdAt: string;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;

    @Column()
    public activated: boolean;
}
