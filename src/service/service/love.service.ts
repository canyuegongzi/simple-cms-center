import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Post} from '../../model/entity/post.entity';
import {ApiErrorCode} from '../../config/api-error-code.enum';
import {ApiException} from '../../common/error/exceptions/api.exception';
import {Category} from '../../model/entity/category.entity';
import {Tag} from '../../model/entity/tag.entity';
import {Love} from '../../model/entity/love.entity';
import {CreateLoveDto} from '../../model/DTO/love/create_love.dto';
import {getSystemInfo} from '../../utils/system';
import {QueryLoveDto} from '../../model/DTO/love/query_love.dto';

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
  ) {}
  /**
   * 查询喜欢列表
   * @param query
   */
  public async getList(query: QueryLoveDto): Promise<any> {
    try {
      const res = await this.loveRepository
          .createQueryBuilder('c')
          .where('c.isDelete = :isDelete', { isDelete: 0})
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
      let lovePost: Post;
      const { loveIp, city, province, address, browser, system} = getSystemInfo(info);
      try {
        lovePost = await this.postRepository
            .createQueryBuilder()
            .where('id = :id', { id: params.postId})
            .getOne();
      } catch (e) {
          throw new ApiException('文章不存在', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
      }
      await this.postRepository
          .createQueryBuilder('p')
          .update(Post)
          .set({ likes: lovePost.likes + 1})
          .where('id = :id', { id: params.postId })
          .execute();
      return await this.loveRepository
          .createQueryBuilder('l')
          .insert()
          .into(Love)
          .values([{userId: params.userId, userName: params.userName, time: params.time,
            email: params.email || '', post: lovePost, type: params.type, loveIp, city, province, address, browser, system}])
          .execute();
    } catch (e) {
      throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 取消喜欢
   * @param params
   */
  public async cancelLove(params: any) {
    try {
      return  await this.loveRepository
          .createQueryBuilder('l')
          .update(Love)
          .set({ isDelete: 1})
          .where('id = :id', { id: params})
          .execute();
    } catch (e) {
      throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }
}
