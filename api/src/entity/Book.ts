import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public publisher: string;

    @Column()
    public subject: string;

    @Column()
    public short: string;

    @Column()
    public language: string;

    @Column()
    public branch: string;

    @Column()
    public uebergang: string;

    @Column()
    public 5: string;

    @Column()
    public 6: string;

    @Column()
    public 7: string;

    @Column()
    public 8: string;

    @Column()
    public 9: string;

    @Column()
    public 10: string;

    @Column()
    public Q11: string;

    @Column()
    public Q12: string;

    @Column()
    public Q13: string;
}
