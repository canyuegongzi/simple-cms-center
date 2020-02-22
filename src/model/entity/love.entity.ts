import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Post} from './post.entity';
// tslint:disable-next-line:import-spacing
import { Comment } from  './comment.entity';

@Entity()
export class Love {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    userId: number;

    @Column('longtext')
    time: string;

    @Column()
    userName: string;

    @Column({nullable: true})
    loveIp: string;

    // 默认类型1 文章喜欢 2 评论喜欢
    @Column({default: 1})
    type: number;

    @Column({default: 0})
    isDelete: number;

    @Column('longtext', {nullable: true})
    email: string;

    @Column({nullable: true})
    city: string;

    @Column({nullable: true})
    province: string;

    @Column({nullable: true})
    address: string;

    @Column({nullable: true})
    browser: string;

    @Column({nullable: true})
    system: string;

    @ManyToOne(type => Post, post => post.loves)
    post: Post;

    @ManyToOne(type => Comment, comment => comment.loves)
    comment: Comment;

    @Column({default: '', nullable: true })
    crateTime: string;

    @Column({default: '', nullable: true })
    updateTime: string;

    @Column({default: '', nullable: true })
    deleteTime: string;
}
