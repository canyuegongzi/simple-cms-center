import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Post} from './post.entity';
import {Love} from './love.entity';

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

    @OneToMany(type => Love, love => love.comment)
    loves: Love[];

    @Column({nullable: true, default: 0})
    likes: number;

    @Column({default: '', nullable: true })
    crateTime: string;

    @Column({default: '', nullable: true })
    updateTime: string;

    @Column({default: '', nullable: true })
    deleteTime: string;
}
