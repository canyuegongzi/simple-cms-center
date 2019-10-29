import {Body, Controller, Get, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import { TransformInterceptor } from '../common/shared/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/shared/interceptors/logging.interceptor';
import {DeletePostDto} from '../model/DTO/post/delete_post.dto';
import {CreateCategoryDto} from '../model/DTO/category/create_category.dto';
import {UpdateCategoryDto} from '../model/DTO/category/update_category.dto';
import {QueryCategoryDtoDto} from '../model/DTO/category/query_category.dto';
import {CategoryService} from '../service/service/category.service';

@Controller('category')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class CategoryController {
  constructor(
    @Inject(CategoryService) private readonly categoryService: CategoryService,
  ) {}

  /**
   * 新增分类
   */
  @Post('add')
  public async creatCategory(@Body() params: CreateCategoryDto) {
    try {
      const res1 = await this.categoryService.findOneByName(params.code);
      if (res1) {
        return  { code: 200, message: '标签已经存在' };
      }
      const res = await this.categoryService.creatCategory(params);
      return  { code: 200,  message: '操作成功', success: true };
    } catch (e) {
      return  { code: 200, message: e.errorMessage, success: false };
    }
  }

  /**
   * 修改分类
   * @param params
   */
  @Post('update')
  public async updateCategory(@Body() params: UpdateCategoryDto) {
    try {
      const res = await this.categoryService.updateCategory(params);
      return  { code: 200, message: '操作成功', success: true };
    } catch (e) {
      return  { code: 200, message: e.errorMessage , success: false};
    }
  }

  /**
   * 删除分类
   * @param params
   */
  @Post('delete')
  public async deleteCategory(@Body() params: DeletePostDto) {
    try {
      const res = await this.categoryService.deleteCategory(params.id);
      return  { code: 200, message: '操作成功', success: true };
    } catch (e) {
      return  { code: 200, message: e.errorMessage, success: false };
    }
  }

  /**
   * 查询分类列表
   * @param params
   */
  @Get('list')
  public async getList(@Query() params: QueryCategoryDtoDto) {
    try {
      const res = await this.categoryService.getList(params);
      const getParentName = (parentId: any, id: any) => {
        let str = '';
        const arr = [];
        res.data.map((item: any) => {
          if ( item.id === parentId ) { str = item.name; }
          if (item.parentId === id) { arr.push(item); }
        });
        return { parentName: str, children: arr };
      };
      res.data.forEach((item: any) => {
        item.parentName = getParentName(item.parentId, item.id).parentName;
        item.num = getParentName(item.parentId, item.id).children.length;
      });
      return  { code: 200, data: res, message: '查询成功' };
    } catch (e) {
      return  { code: 200, data: null, message: e.errorMessage };
    }
  }

  @Get('categoryTree')
  public async getTree() {
    try {
      const res = await this.categoryService.getCategoryTree();
      return  { code: 200, data: res, message: '查询成功' };
    } catch (e) {
      return  { code: 200, data: null, message: e.errorMessage };
    }
  }

  /**
   * 查询分类列表
   * @param params
   */
  @Get('info')
  public async getInfo(@Query('id') id) {
    try {
      const res = await this.categoryService.getInfoCateGory(id);
      return  { code: 200, data: res, message: '查询成功' };
    } catch (e) {
      return  { code: 200, data: null, message: e.errorMessage };
    }
  }
}
