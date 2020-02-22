import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Post} from './post.entity';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(type => Post, post => post.tags)
    posts: Post[];

    @Column({ nullable: false})
    name: string;

    @Column()
    code: string;

    // 是否删除 0 默认没有删除
    @Column({default: 0})
    isDelete: number;

    @Column({ nullable: false})
    desc: string;

    @Column({default: '', nullable: true })
    crateTime: string;

    @Column({default: '', nullable: true })
    updateTime: string;

    @Column({default: '', nullable: true })
    deleteTime: string;
}
