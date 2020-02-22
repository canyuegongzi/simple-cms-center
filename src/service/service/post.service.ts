import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Post} from '../../model/entity/post.entity';
import {CreatePostDto} from '../../model/DTO/post/create_post.dto';
import {ApiErrorCode} from '../../config/api-error-code.enum';
import {ApiException} from '../../common/error/exceptions/api.exception';
import {Category} from '../../model/entity/category.entity';
import {Tag} from '../../model/entity/tag.entity';
import {UpdatePostDto} from '../../model/DTO/post/update_post.dto';
import {QueryPostDto} from '../../model/DTO/post/query_post.dto';
import {formatDate} from '../../utils/data-time';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   * 创建文章
   * @param params
   */
  public async createPost(params: CreatePostDto) {
    try {
      let postId: number;
      try {
        const res = await this.postRepository
            .createQueryBuilder('p')
            .insert()
            .into(Post)
            .values([ {time: new Date().getTime(), crateTime: formatDate(), updateTime: formatDate(), title: params.title, desc: params.desc, contentMd: params.contentMd, recommend: params.recommend, linkImg: params.linkImg, content: params.content, userId: params.userId || '', category: await this.categoryRepository.findOne(params.categoryId)}])
            .execute();
        postId = res.identifiers[0].id;
        const post = await this.postRepository.findOne(postId, {relations: ['tags']});
        try {
          return await this.postRepository
              .createQueryBuilder()
              .relation(Post, 'tags')
              .of(postId)
              .addAndRemove(params.tags, post.tags.map( t => t.id));
        } catch (e) {
          throw new ApiException('标签创建失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
      } catch (e) {
        throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 更新文章
   * @param params
   */
  public async updatePost(params: UpdatePostDto) {
    try {
      const postId: number = params.id;
      try {
        const res = await this.postRepository
            .createQueryBuilder('p')
            .update(Post)
            .set({time: new Date().getTime(), title: params.title, updateTime: formatDate(), contentMd: params.contentMd, desc: params.desc, recommend: params.recommend, linkImg: params.linkImg, content: params.content, userId: params.userId || '', category: await this.categoryRepository.findOne(params.categoryId)})
            .where('id = :id', { id: params.id })
            .execute();
        const post = await this.postRepository.findOne(params.id, {relations: ['tags']});
        try {
          return await this.postRepository
              .createQueryBuilder()
              .relation(Post, 'tags')
              .of(postId)
              .addAndRemove(params.tags, post.tags.map( t => t.id));
        } catch (e) {
          throw new ApiException('修改失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
      } catch (e) {
        throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 阅读数量增加
   * @param num
   * @param id
   */
  public async viewsAdd(num: number, id: number | string) {
    try {
      const newViews = num ++;
      return await this.postRepository
          .createQueryBuilder('p')
          .update(Post)
          .set({views: newViews})
          .where('id = :id', { id })
          .execute();
    } catch (e) {
      throw new ApiException('阅读数量增加失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 喜欢
   * @param recommend
   * @param id
   */
  public async likesAdd(likes: number, id: number | string) {
    try {
      return await this.postRepository
          .createQueryBuilder('p')
          .update(Post)
          .set({ likes})
          .where('id = :id', { id })
          .execute();
    } catch (e) {
      throw new ApiException('喜欢修改失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 修改是否推推荐
   * @param recommend
   * @param id
   */
  public async editRecommend(recommend: number, id: number | string) {
    try {
      return await this.postRepository
          .createQueryBuilder('p')
          .update(Post)
          .set({ recommend})
          .where('id = :id', { id })
          .execute();
    } catch (e) {
      throw new ApiException('推荐修改失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 删除文章
   * @param recommend
   * @param id
   */
  public async deletePost(id: Array<number | string>) {
    try {
      return await this.postRepository
          .createQueryBuilder('p')
          .update(Post)
          .set({ isDelete: 1, deleteTime: formatDate() })
          .whereInIds(id)
          .execute();
    } catch (e) {
      throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 恢复文章
   * @param recommend
   * @param id
   */
  public async recoverPost(id: Array<number | string>) {
    try {
      return await this.postRepository
          .createQueryBuilder('p')
          .update(Post)
          .set({ isDelete: 0, updateTime: formatDate() })
          .whereInIds(id)
          .execute();
    } catch (e) {
      throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 查询文章的列表
   * @param query
   */
  public async getList(query: QueryPostDto): Promise<any> {
    try {
      const queryConditionList = ['p.isDelete = :isDelete'];
      const leftJoinConditionList = [];
      let leftJoinConditionTags = {};
      if (query.categoryId) {
        queryConditionList.push('p.categoryId = :categoryId');
      }
      if (query.title) {
        queryConditionList.push('p.title LIKE :title');
      }
      // @ts-ignore
      if (query.recommend !== '' && query.recommend !== undefined && query.recommend !== null) {
        queryConditionList.push('p.recommend = :recommend');
      }
      if (query.startTime) {
        queryConditionList.push('p.time >= :startTime');
      }
      if (query.endTime) {
        queryConditionList.push('p.time <= :endTime');
      }
      if (query.tagId) {
        leftJoinConditionList.push('tag.id = :id');
        queryConditionList.push('tag.id = :tagId');
        leftJoinConditionTags = {id: query.tagId};
      }
      const queryCondition = queryConditionList.join(' AND ');
      const leftJoinCondition = leftJoinConditionList.join('');
      const res = await this.postRepository
          .createQueryBuilder('p')
          .leftJoinAndSelect('p.category', 'c')
          .leftJoinAndSelect('p.tags', 'tag', leftJoinCondition, leftJoinConditionTags )
          .where(queryCondition, {
            title: `%${query.title}%`,
            categoryId: query.categoryId,
            isDelete: query.isDelete ? query.isDelete : 0,
            tagId: query.tagId,
            recommend: query.recommend,
            startTime: query.startTime,
            endTime: query.endTime,
          })
          .orderBy('p.time', 'DESC')
          .skip((query.page - 1) * query.pageSize)
          .take(query.pageSize)
          .select(['p.time', 'p.id', 'p.views', 'p.title', 'p.crateTime', 'p.updateTime', 'p.deleteTime', 'p.desc',  'p.linkImg', 'c.name', 'c.id', 'tag.id', 'tag.name', 'p.likes'])
          .getManyAndCount();
      return  { data: res[0], count: res[1]};
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 查询详情
   * @param id
   */
  public async getInfoPost(id: any) {
    try {
      return  await this.postRepository
          .createQueryBuilder('p')
          .leftJoinAndSelect('p.category', 'category')
          .leftJoinAndSelect('p.tags', 'tag' )
          .leftJoinAndSelect('p.comments', 'comments', 'comments.isDelete = :isDelete', { isDelete: 0 })
          .where('p.id = :id', { id})
          .getOne();
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 查询喜欢
   * @param id
   */
  public async getLovesList(query: QueryPostDto) {
    try {
      const res = await this.postRepository
          .createQueryBuilder('p')
          .leftJoinAndSelect('p.category', 'category')
          .leftJoinAndSelect('p.tags', 'tag' )
          .leftJoinAndSelect('p.loves', 'loves')
          .where('p.isDelete = :isDelete', { isDelete: 0})
          .orderBy('p.time', 'ASC')
          .skip((query.page - 1) * query.pageSize)
          .take(query.pageSize)
          .select(['p.time', 'p.id', 'p.title', 'p.desc', 'p.linkImg', 'category.name', 'category.id', 'tag.id', 'tag.name', 'p.likes', 'loves'])
          .getManyAndCount();
      return  { data: res[0], count: res[1]};
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }
}
