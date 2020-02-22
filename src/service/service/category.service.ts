import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Post} from '../../model/entity/post.entity';
import {ApiErrorCode} from '../../config/api-error-code.enum';
import {ApiException} from '../../common/error/exceptions/api.exception';
import {Category} from '../../model/entity/category.entity';
import {Tag} from '../../model/entity/tag.entity';
import {CreateCategoryDto} from '../../model/DTO/category/create_category.dto';
import {UpdateCategoryDto} from '../../model/DTO/category/update_category.dto';
import {QueryCategoryDtoDto} from '../../model/DTO/category/query_category.dto';
import {listToTree} from '../../utils/tree-data';
import {formatDate} from '../../utils/data-time';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}
  /**
   * 查询分类
   * @param query
   */
  public async getList(query: QueryCategoryDtoDto): Promise<any> {
    try {
      const queryConditionList = ['c.isDelete = :isDelete'];
      if (query.name) {
        queryConditionList.push('c.name like :name');
      }
      const queryCondition = queryConditionList.join(' AND ');
      const res = await this.categoryRepository
          .createQueryBuilder('c')
          .where(queryCondition, {
            name: `%${query.name}%`,
            isDelete: 0,
          })
          .orderBy('c.name', 'ASC')
          .addOrderBy('c.code')
          .skip((query.page - 1) * query.pageSize)
          .take(query.pageSize)
          .getManyAndCount();
      return  { data: res[0], count: res[1]};
    } catch (e) {
      throw new ApiException('查询失败', ApiErrorCode.ROLE_LIST_FAILED, 200);
    }
  }

  /**
   * 创建分类
   * @param params
   */
  public async creatCategory(params: CreateCategoryDto) {
    try {
      return await this.categoryRepository
          .createQueryBuilder('c')
          .insert()
          .into(Category)
          .values([{name: params.name, crateTime: formatDate(), code: params.code, desc: params.desc, parentId: params.parentId, sort: params.sort}])
          .execute();
    } catch (e) {
      throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 更新分类
   * @param params
   */
  public async updateCategory(params: UpdateCategoryDto) {
    try {
      return await this.categoryRepository
          .createQueryBuilder('c')
          .update(Category)
          .set({ name: params.name, updateTime: formatDate(), desc: params.desc, code: params.code, parentId: params.parentId, sort: params.sort})
          .where('id = :id', { id: params.id })
          .execute();
    } catch (e) {
      throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 删除分类
   * @param id
   */
  public  async deleteCategory(id: Array<string | number>) {
    try {
      return await this.categoryRepository
          .createQueryBuilder('c')
          .update(Category)
          .set({ isDelete: 1, deleteTime: formatDate()})
          .whereInIds(id)
          .execute();
    } catch (e) {
      throw new ApiException('操作失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 查询分类树的数据
   */
  public async getCategoryTree() {
    try {
      const res  = await this.categoryRepository
          .createQueryBuilder('c')
          .getManyAndCount();
      const treeData = listToTree(res[0], 'id', 'parentId', 'children');
      return  { data: treeData, count: res[1]};
    } catch (e) {
      throw new ApiException('查询失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 通过code查询
   * @param name
   */
  public async findOneByName(code: string): Promise<Category> {
    return await this.categoryRepository.findOne({ code });
  }

  /**
   * 查询详情
   * @param id
   */
  public async getInfoCateGory(id: any): Promise<Category> {
    try {
      return await this.categoryRepository.findOne({ id });
    } catch (e) {
      throw new ApiException('查询失败', ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
    }
  }

  /**
   * 查询所有分类
   * @param query
   */
  public async getAllList() {
    try {
      const queryConditionList = ['c.isDelete = :isDelete'];
      const queryCondition = queryConditionList.join(' AND ');
      return  await this.categoryRepository
          .createQueryBuilder('c')
          .where(queryCondition, {
            isDelete: 0,
          })
          .orderBy('c.name', 'ASC')
          .getMany();
    } catch (e) {
      throw new ApiException('查询失败', ApiErrorCode.ROLE_LIST_FAILED, 200);
    }
  }
}
