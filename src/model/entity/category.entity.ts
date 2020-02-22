import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Post} from './post.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column()
    parentId: number;

    @Column()
    sort: number;

    @Column()
    desc: string;

    @Column({default: 0})
    isDelete: number;

    @Column()
    code: string;

    @OneToMany(type => Post, post => post.category)
    posts: Post[];

    @Column({default: '', nullable: true })
    crateTime: string;

    @Column({default: '', nullable: true })
    updateTime: string;

    @Column({default: '', nullable: true })
    deleteTime: string;
}
