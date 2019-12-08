import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Post} from './post.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    userId: string;

    @Column('longtext', {nullable: false})
    content: string;

    @Column('longtext')
    time: string;

    @Column()
    parentId: number;

    @Column()
    userName: string;

    @Column({default: 0})
    isDelete: number;

    @Column('longtext')
    email: string;

    @ManyToOne(type => Post, post => post.comments)
    post: Post;
}
