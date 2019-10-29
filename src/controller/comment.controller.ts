import {Body, Controller, Get, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import { TransformInterceptor } from '../common/shared/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/shared/interceptors/logging.interceptor';
import {PostService} from '../service/service/post.service';
import {CommentService} from '../service/service/comment.service';
import {CreateCommentDto} from '../model/DTO/comment/create_comment.dto';
import {UpdateCommentDto} from '../model/DTO/comment/update_comment.dto';
import {DeleteCommentDto} from '../model/DTO/comment/delete_comment.dto';
import {QueryCommentDto} from '../model/DTO/comment/query_comment.dto';

@Controller('comment')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class CommentController {
  constructor(
    @Inject(CommentService) private readonly commentService: CommentService,
  ) {}

  /**
   * 添加评论
   */
  @Post('add')
  public async creatComment(@Body() params: CreateCommentDto) {
    try {
      const res = await this.commentService.createComment(params);
      return  { code: 200,  message: '操作成功' };
    } catch (e) {
      return  { code: 200, message: e.errorMessage };
    }
  }

  /**
   * 修改评论
   * @param params
   */
  @Post('update')
  public async updateComment(@Body() params: UpdateCommentDto) {
    try {
      const res = await this.commentService.updateComment(params);
      return  { code: 200,  message: '操作成功' };
    } catch (e) {
      return  { code: 200, message: e.errorMessage };
    }
  }

  /**
   * 删除评论
   * @param params
   */
  @Post('delete')
  public async deleteComment(@Body() params: DeleteCommentDto) {
    try {
      const res = await this.commentService.deleteComment(params.id);
      return  { code: 200, message: '操作成功', success: true };
    } catch (e) {
      return  { code: 200, message: e.errorMessage, success: false};
    }
  }

  /**
   * 查询评论列表
   * @param params
   */
  @Get('list')
  public async getList(@Query() params: QueryCommentDto) {
    try {
      const res = await this.commentService.getList(params);
      return  { code: 200, data: res, message: '查询成功', success: true };
    } catch (e) {
      return  { code: 200, data: [],  message: e.errorMessage, success: false };
    }
  }

  /**
   * 查询评论详情
   * @param params
   */
  @Get('info')
  public async getCommentInfo(@Query('id') id: any) {
    try {
      const res = await this.commentService.getInfoComment(id);
      return  { code: 200, data: res, message: '查询成功' };
    } catch (e) {
      return  { code: 200, data: [],  message: e.errorMessage };
    }
  }

}
