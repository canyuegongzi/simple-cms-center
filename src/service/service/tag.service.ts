import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Post} from '../../model/entity/post.entity';
import {ApiErrorCode} from '../../config/api-error-code.enum';
import {ApiException} from '../../common/error/exceptions/api.exception';
import {Category} from '../../model/entity/category.entity';
import {Tag} from '../../model/entity/tag.entity';
import {CreateTagDto} from '../../model/DTO/tag/create_tag.dto';
import {UpdateTagDto} from '../../model/DTO/tag/update_tag.dto';
import {QueryTagDto} from '../../model/DTO/tag/query_tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   * 创建标签
   * @param params
   */
  public async createTag(params: CreateTagDto) {
    try {
      return await this.tagRepository
          .createQueryBuilder('t')
          .insert()
          .into(Tag)
          .values([{name: params.name, code: params.code, desc: params.desc }])
          .execute();
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 更新标签
   * @param params
   */
  public async updateTag(params: UpdateTagDto) {
    try {
      return await this.tagRepository
          .createQueryBuilder()
          .update(Tag)
          .set({ name: params.name, desc: params.desc, code: params.code })
          .where('id = :id', { id: params.id })
          .execute();
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 删除标签
   * @param recommend
   * @param id
   */
  public async deleteTag(id: Array<number | string>) {
    try {
      return await this.tagRepository
          .createQueryBuilder()
          .update(Tag)
          .set({ isDelete: 1})
          .whereInIds(id)
          .execute();
    } catch (e) {
      throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 查询标签列表
   * @param query
   */
  public async getList(query: QueryTagDto): Promise<any> {
    try {
      const res = await this.tagRepository
          .createQueryBuilder('t')
          .orWhere('t.name like :name', { name: `%${query.name}%`})
          .orderBy('t.name', 'ASC')
          .andWhere('t.isDelete = :isDelete', { isDelete: 0})
          .skip((query.page - 1) * query.pageSize)
          .take(query.pageSize)
          .getManyAndCount();
      return  { data: res[0], count: res[1]};
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 通过code查询
   * @param name
   */
  public async findOneByName(code: string): Promise<Tag> {
    return await this.tagRepository.findOne({ code });
  }

  /**
   * 查询详情
   * @param id
   */
  public async getInfoTag(id: any): Promise<Tag> {
    try {
      return await this.tagRepository.findOne({ id });
    } catch (e) {
      throw new ApiException('查询失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 查询标签下的文章列表
   * @param id
   */
  public async getPostList(params: QueryTagDto) {
    try {
      const res = await this.tagRepository
          .createQueryBuilder('t')
          .leftJoinAndSelect('t.posts', 'p')
          .where('t.isDelete = :isDelete', { isDelete: 0})
          .andWhere('t.id = :id', {id:  params.tagId})
          .orderBy('t.name', 'ASC')
          .skip((params.page - 1) * params.pageSize)
          .take(params.pageSize)
          .getManyAndCount();
      return  { data: res[0], count: res[1]};
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 查询所有标签
   */
  public async getAllList() {
    try {
      return this.tagRepository
          .createQueryBuilder('t')
          .getMany()
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }
}
