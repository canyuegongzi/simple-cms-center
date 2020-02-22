import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Post} from '../../model/entity/post.entity';
import {ApiErrorCode} from '../../config/api-error-code.enum';
import {ApiException} from '../../common/error/exceptions/api.exception';
import {Category} from '../../model/entity/category.entity';
import {Tag} from '../../model/entity/tag.entity';
import {Love} from '../../model/entity/love.entity';
import {Comment} from '../../model/entity/comment.entity';
import {CreateLoveDto} from '../../model/DTO/love/create_love.dto';
import {getSystemInfo} from '../../utils/system';
import {QueryLoveDto} from '../../model/DTO/love/query_love.dto';
import {formatDate} from '../../utils/data-time';

@Injectable()
export class LoveService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Love)
    private readonly loveRepository: Repository<Love>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  /**
   * 查询喜欢列表
   * @param query
   */
  public async getList(query: QueryLoveDto): Promise<any> {
    try {
      const queryConditionList = ['l.isDelete = :isDelete'];
      if (query.type) {
        queryConditionList.push('l.type = :type');
      }
      if (query.email) {
        queryConditionList.push('l.email = :email');
      }
      if (query.userName) {
        queryConditionList.push('l.userName = :userName');
      }
      if (query.startTime) {
        queryConditionList.push('l.time >= :startTime');
      }
      if (query.endTime) {
        queryConditionList.push('l.time <= :endTime');
      }
      const queryCondition = queryConditionList.join(' AND ');
      const res = await this.loveRepository
          .createQueryBuilder('l')
          .where(queryCondition, {
            isDelete: 0,
            userName: `%${query.userName}%`,
            email: `%${query.email}%`,
            type: query.type,
            startTime: query.startTime,
            endTime: query.endTime,
          })
          .skip((query.page - 1) * query.pageSize)
          .take(query.pageSize)
          .getManyAndCount();
      return  { data: res[0], count: res[1]};
    } catch (e) {
       throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 喜欢
   * @param params
   * @param info
   */
  public async creatLove(params: CreateLoveDto, info: any) {
    try {
      let loveObj: any;
      const { loveIp, city, province, address, browser, system} = getSystemInfo(info);
      try {
        if (params.type === 1) {
          try {
            loveObj = await this.postRepository
                .createQueryBuilder()
                .where('id = :id', { id: params.postId})
                .getOne();
          } catch (e) {
            throw new ApiException('喜欢对象不能为空', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
          }
          try {
            await this.postRepository
                .createQueryBuilder('p')
                .update(Post)
                .set({ likes: loveObj.likes + 1})
                .where('id = :id', { id: params.postId })
                .execute();
            return await this.loveRepository
                .createQueryBuilder('l')
                .insert()
                .into(Love)
                .values([{userId: params.userId, userName: params.userName, time: params.time,
                  email: params.email || '', post: loveObj, type: params.type, loveIp, city, province, address, browser, system}])
                .execute();
          } catch (e) {
            throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
          }
        } else if (params.type === 2) {
          try {
            loveObj = await this.commentRepository
                .createQueryBuilder()
                .where('id = :id', { id: params.commentId})
                .getOne();
          } catch (e) {
            throw new ApiException('喜欢对象不能为空', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
          }
          try {
            await this.commentRepository
                .createQueryBuilder('c')
                .update(Comment)
                .set({ likes: loveObj.likes + 1})
                .where('id = :id', { id: params.commentId })
                .execute();
            return await this.loveRepository
                .createQueryBuilder('l')
                .insert()
                .into(Love)
                .values([{userId: params.userId, userName: params.userName, time: params.time,
                  email: params.email || '', comment: loveObj, post: null, type: params.type, loveIp, city, province, address, browser, system}])
                .execute();
          } catch (e) {
            throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
          }
        } else {
          throw new ApiException('喜欢对象不能为空', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
      } catch (e) {
          throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 取消喜欢
   * @param params
   */
  public async cancelLove(params: Array<number | string>, info: any) {
    try {
      try {
        return await this.loveRepository
            .createQueryBuilder('l')
            .update(Love)
            .set({ isDelete: 1, updateTime: formatDate() })
            .whereInIds(params)
            .execute();
      } catch (e) {
        throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }
}
