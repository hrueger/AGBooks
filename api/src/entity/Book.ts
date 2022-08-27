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
    public comment: string;

    @Column()
    public language: string;

    @Column()
    public branch: string;

    @Column()
    public uebergang: boolean;

    @Column()
    public 5: boolean;

    @Column()
    public 6: boolean;

    @Column()
    public 7: boolean;

    @Column()
    public 8: boolean;

    @Column()
    public 9: boolean;

    @Column()
    public 10: boolean;

    @Column()
    public Q11: boolean;

    @Column()
    public Q12: boolean;

    @Column()
    public Q13: boolean;

    public alert?: string;

    public number?: number;

    public editing?: boolean;
}
