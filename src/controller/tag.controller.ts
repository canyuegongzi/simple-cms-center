import {Body, Controller, Get, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import { TransformInterceptor } from '../common/shared/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/shared/interceptors/logging.interceptor';
import {TagService} from '../service/service/tag.service';
import {CreateTagDto} from '../model/DTO/tag/create_tag.dto';
import {UpdateTagDto} from '../model/DTO/tag/update_tag.dto';
import {QueryTagDto} from '../model/DTO/tag/query_tag.dto';

@Controller('tag')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class TagController {
  constructor(
    @Inject(TagService) private readonly tagService: TagService,
  ) {}

  /**
   * 添加标签
   */
  @Post('add')
  public async creatPost(@Body() params: CreateTagDto) {
    try {
      const res1 = await this.tagService.findOneByName(params.code);
      if (res1) {
        return  { code: 200, message: '标签已经存在' };
      }
      const res = await this.tagService.createTag(params);
      return  { code: 200, message: '操作成功', success: true };
    } catch (e) {
      return  { code: 200, message: '操作失败', success: false };
    }
  }

  /**
   * 修改标签
   * @param params
   */
  @Post('update')
  public async updatePost(@Body() params: UpdateTagDto) {
    try {
      const res = await this.tagService.updateTag(params);
      return  { code: 200,  message: '操作成功', success: true };
    } catch (e) {
      return  { code: 200, message: '操作失败', success: false };
    }
  }

  /**
   * 删除标签
   * @param params
   */
  @Post('delete')
  public async deletePost(@Body('id') params) {
    try {
      const res = await this.tagService.deleteTag(params);
      return  { code: 200, message: '操作成功', success: true };
    } catch (e) {
      return  { code: 200, message: '操作失败', success: false };
    }
  }

  /**
   * 查询标签列表
   * @param params
   */
  @Get('list')
  public async getList(@Query() params: QueryTagDto) {
    try {
      const res = await this.tagService.getList(params);
      return  { code: 200, data: res, message: '查询成功', success: true };
    } catch (e) {
      return  { code: 200, message: '查询失败', success: false };
    }
  }

  /**
   * 查询标签列表
   * @param params
   */
  @Get('all')
  public async getAllList() {
    try {
      const res = await this.tagService.getAllList();
      return  { code: 200, data: res, message: '查询成功', success: true };
    } catch (e) {
      return  { code: 200, message: '查询失败', success: false };
    }
  }

  /**
   * 查询标签详情
   * @param params
   */
  @Get('info')
  public async getInfo(@Query('id') id) {
    try {
      const res = await this.tagService.getInfoTag(id);
      return  { code: 200, data: res, message: '查询成功', success: true };
    } catch (e) {
      return  { code: 200, data: null, message: e.errorMessage, success: false };
    }
  }

  /**
   * 查询标签下的文章列表
   * @param params
   */
  @Get('postList')
  public async getPostList(@Query() params: QueryTagDto) {
    try {
      const res = await this.tagService.getPostList(params);
      return  { code: 200, data: res, message: '查询成功' };
    } catch (e) {
      return  { code: 200, message: '查询失败' };
    }
  }
}
