import {Body, Controller, Get, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import { TransformInterceptor } from '../common/shared/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/shared/interceptors/logging.interceptor';
import {PostService} from '../service/service/post.service';
import {CreatePostDto} from '../model/DTO/post/create_post.dto';
import {UpdatePostDto} from '../model/DTO/post/update_post.dto';
import {DeletePostDto} from '../model/DTO/post/delete_post.dto';
import {QueryPostDto} from '../model/DTO/post/query_post.dto';

@Controller('post')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class PostController {
  constructor(
    @Inject(PostService) private readonly postService: PostService,
  ) {}

  /**
   * 添加文章
   */
  @Post('add')
  public async creatPost(@Body() params: CreatePostDto) {
    try {
      const res = await this.postService.createPost(params);
      return  { code: 200, res, message: '操作成功', success: true };
    } catch (e) {
      return  { code: 200, message: e.errorMessage, success: false };
    }
  }

  /**
   * 修改文章
   * @param params
   */
  @Post('update')
  public async updatePost(@Body() params: UpdatePostDto) {
    try {
      const res = await this.postService.updatePost(params);
      return  { code: 200, res, message: '操作成功', success: true };
    } catch (e) {
      return  { code: 200, message: e.errorMessage, success: false };
    }
  }

  /**
   * 删除文章
   * @param params
   */
  @Post('delete')
  public async deletePost(@Body() params: DeletePostDto) {
    try {
      const res = await this.postService.deletePost(params.id);
      return  { code: 200, message: '操作成功', success: true };
    } catch (e) {
      return  { code: 200, message: e.errorMessage, success: false};
    }
  }

  /**
   * 查询文章列表
   * @param params
   */
  @Get('list')
  public async getList(@Query() params: QueryPostDto) {
    try {
      const res = await this.postService.getList(params);
      return  { code: 200, data: res, message: '查询成功' };
    } catch (e) {
      return  { code: 200, data: [],  message: e.errorMessage };
    }
  }

  /**
   * 修改推荐状态
   * @param params
   */
  @Post('editRecommend')
  public async editRecommend(@Body() params) {
    try {
      const {recommend, id} = params;
      const res = await this.postService.editRecommend(recommend, id);
      return  { code: 200, message: '操作成功' };
    } catch (e) {
      return  { code: 200, message: e.errorMessage };
    }
  }

  /**
   * 阅读数量增加
   * @param params
   */
  @Post('viewsAdd')
  public async viewsAdd(@Body() params) {
    try {
      const {views, id} = params;
      const res = await this.postService.viewsAdd(views, id);
      return  { code: 200,  message: '操作成功' };
    } catch (e) {
      return  { code: 200, message: e.errorMessage };
    }
  }

  /**
   * 查询文章详情
   * @param params
   */
  @Get('info')
  public async getInfoPost(@Query('id') id: any) {
    try {
      const res = await this.postService.getInfoPost(id);
      return  { code: 200, data: res, message: '查询成功' };
    } catch (e) {
      return  { code: 200, data: [],  message: e.errorMessage };
    }
  }

  /**
   * 获取喜欢的列表
   * @param params
   */
  @Get('loves')
  public async getLovesList(@Query() params: QueryPostDto) {
    try {
      const res = await this.postService.getLovesList(params);
      return  { code: 200, data: res, message: '查询成功' };
    } catch (e) {
      return  { code: 200, data: [],  message: e.errorMessage };
    }
  }
}
