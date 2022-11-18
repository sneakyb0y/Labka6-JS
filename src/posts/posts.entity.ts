import { Comments } from 'src/comments/comments.entity';
import { User } from 'src/user/user.entity';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Posts extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'text', length: 140 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({type: 'text', nullable: false})
    createdBy: string;

    @Column({ default: false, name: 'active' })
    isActive: boolean;

    @Column({ type: 'datetime', default: new Date().toISOString() })
    createdAt: string;

    @Column({ type: 'datetime', nullable: true })
    updatedAt: string;

    @Column({ type: 'datetime', nullable: true })
    deletedAt: string;

    @OneToMany(() => Comments, (comment) => comment.post)
    comments: Comments[];

    @ManyToOne(() => User, (user) => user.posts)
    user: User;
}
