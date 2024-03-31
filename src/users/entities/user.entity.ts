import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class UsersModel {
    @PrimaryGeneratedColumn() // Primary Column
    id: number;

    @Column({ 
        length: 500,
        unique: true,
        nullable: false,
    })  
    email: string;

    @Column({
        length: 500,
        nullable: false,
    })
    password: string;

    @Column({
        length: 500,
        nullable: true,
    })
    name: string;
}