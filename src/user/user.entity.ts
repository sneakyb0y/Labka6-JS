import { Comments } from "src/comments/comments.entity";
import { Posts } from "src/posts/posts.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'text', length: 100, unique: true})
    username: string;

    @Column({type: 'text', length: 160, unique: true})
    email: string;

    @Column({type: 'text', length: 120, default: ""})
    firstName: string;

    @Column({type: 'text', length: 120, default: ""})
    lastName: string;

    @Column({type: 'text', default: 'local'})
    provider: string;

    @Column({type: 'text', length: 60})
    password: string;

    @Column({type: 'boolean', default: false})
    confirmed: string;

    @Column({type: 'datetime', default: new Date().toISOString()})
    createdAt: string;

    @Column({type: 'datetime', nullable: true})
    updatedAt: string;

    @Column({type: 'datetime', nullable: true})
    deletedAt: string;

    @OneToMany(() => Posts, (posts) => posts.user)
    posts: Posts[]

    @OneToMany(() => Comments, (comments) => comments.user)
    comments: Comments[]
}