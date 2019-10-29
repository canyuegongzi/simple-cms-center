import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Post} from '../../model/entity/post.entity';
import {ApiErrorCode} from '../../config/api-error-code.enum';
import {ApiException} from '../../common/error/exceptions/api.exception';
import {Category} from '../../model/entity/category.entity';
import {Tag} from '../../model/entity/tag.entity';
import {CreateCommentDto} from '../../model/DTO/comment/create_comment.dto';
import {UpdateCommentDto} from '../../model/DTO/comment/update_comment.dto';
import {Comment} from '../../model/entity/comment.entity';
import {QueryCommentDto} from '../../model/DTO/comment/query_comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  /**
   * 查询评论列表
   * @param query
   */
  public async getList(query: QueryCommentDto): Promise<any> {
    try {
      const res = await this.commentRepository
          .createQueryBuilder('c')
          .leftJoinAndSelect('c.post', 'p')
          .orWhere('c.content like :content', { content: `%${query.title}%`})
          .where('c.isDelete = :isDelete', { isDelete: 0})
          .orderBy('c.time', 'ASC')
          .skip((query.page - 1) * query.pageSize)
          .take(query.pageSize)
          .select(['c', 'p.id', 'p.title'])
          .getManyAndCount();
      return  { data: res[0], count: res[1]};
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 查询评论详情
   * @param id
   */
  public async getInfoComment(id: any) {
    try {
      return await this.commentRepository
          .createQueryBuilder('c')
          .leftJoinAndSelect('c.post', 'post')
          .where('c.id = :id', { id})
          .getOne();
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 创建评论
   * @param params
   */
  public async createComment(params: CreateCommentDto) {
    try {
      let commentPost: Post;
      try {
        commentPost = await this.postRepository
            .createQueryBuilder()
            .where('id = :id', { id: params.postId})
            .getOne();
      } catch (e) {
          throw new ApiException('文章不存在', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
      try {
          return await this.commentRepository
              .createQueryBuilder('c')
              .insert()
              .into(Comment)
              .values([{content: params.content, parentId: params.parentId, time: params.time || '', email: params.email || '', userId: params.userId, userName: params.userName, post: commentPost }])
              .execute();
        } catch (e) {
          throw new ApiException('评论失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    } catch (e) {
      console.log(e);
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 更新评论
   * @param params
   */
  public async updateComment(params: UpdateCommentDto) {
    try {
        return this.commentRepository
            .createQueryBuilder('c')
            .update(Comment)
            .set({content: params.content, time: params.time})
            .where('id = :id', { id: params.id })
            .execute();
    } catch (e) {
      throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 删除评论
   * @param id
   */
  public async deleteComment(id: number | string) {
    try {
      return await this.commentRepository
          .createQueryBuilder('c')
          .update(Comment)
          .set({ isDelete: 1})
          .where('id = :id', { id })
          .execute();
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }
}
