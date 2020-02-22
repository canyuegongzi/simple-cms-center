import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Category} from './category.entity';
import {Tag} from './tag.entity';
import { Comment} from './comment.entity';
import {Love} from './love.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    title: string;

    @Column()
    time: number;

    @Column({type: 'text'})
    desc: string;

    @Column({nullable: true, default: 0})
    likes: number;

    @Column({nullable: true, default: 0})
    views: number ;

    @Column({type: 'longtext'})
    content: string;

    @Column({type: 'longtext'})
    contentMd: string;

    @Column()
    userId: string;

    @Column()
    linkImg: string;

    // 是否删除 0 默认没有删除
    @Column({default: 0})
    isDelete: number;

    // 0 默认不推荐 1 推荐
    @Column({default: 0, nullable: false})
    recommend: number;

    @ManyToOne(type => Category, category => category.posts)
    category: Category;

    @OneToMany(type => Comment, comment => comment.post)
    comments: Comment[];

    @OneToMany(type => Love, love => love.post)
    loves: Love[];

    @ManyToMany( type => Tag, tag => tag.posts)
    @JoinTable()
    tags: Tag[];

    @Column({default: '', nullable: true })
    crateTime: string;

    @Column({default: '', nullable: true })
    updateTime: string;

    @Column({default: '', nullable: true })
    deleteTime: string;

}
