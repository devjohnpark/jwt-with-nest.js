import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class UsersModel {
    @PrimaryGeneratedColumn() // Primary Column
    id: number;

    @Column({ 
        length: 50,
        unique: true,
        nullable: false,
    })   // make firstName unique, too; decide which to chose
    email: string;

    @Column({
        length: 50,
        nullable: false,
    })
    password: string;

    @Column()
    name: string;

    @Column()
    age: number;
}