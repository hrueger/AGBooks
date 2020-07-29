import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ default: "" })
    public teacher: string;

    @Column({ default: "" })
    public teacherShort: string;

    @Column({ default: "" })
    public grade: string;

    @Column({ default: "" })
    public course: string;

    @Column({ default: "" })
    public language: "latein" | "französisch" | "gemischt";

    @Column({ default: false })
    public uebergang: boolean;

    @Column({ default: "" })
    public branch: "sprachlich" | "naturwissenschaftlich" | "gemischt";

    @Column({ default: 0 })
    public room: number;

    @Column({ default: 0 })
    public classSize: number;

    @Column({ default: "", type: "simple-json" })
    public order: {
        [id: number] : number;
    }

    @Column({ default: false })
    public orderSubmitted: boolean;

    @Column({ default: false })
    public orderDone: boolean;

    @Column({ default: false })
    public orderAccepted: boolean;

    @Column({ nullable: true })
    public orderTimestamp: Date;

    public token?: string;
}
