import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    frist_name:string
    @Column()
    last_name:string
    @Column()
    email:string
    @Column()
    password:string
    @Column()
    refresh_token:string
    @CreateDateColumn()
    create_at:Date
    @CreateDateColumn()
    update_at: Date;
    @Column({ default: 1 })
    status: number;
 

}