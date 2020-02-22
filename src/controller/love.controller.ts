import {Body, Controller, Get, Inject, Post, Query, Req, UseInterceptors} from '@nestjs/common';
import { TransformInterceptor } from '../common/shared/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/shared/interceptors/logging.interceptor';
import {LoveService} from '../service/service/love.service';
import {CreateLoveDto} from '../model/DTO/love/create_love.dto';
import {QueryLoveDto} from '../model/DTO/love/query_love.dto';

@Controller('love')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class LoveController {
  constructor(
    @Inject(LoveService) private readonly loveService: LoveService,
  ) {}

  /**
   * 喜欢
   */
  @Post('ok')
  public async creatLove(@Body() params: CreateLoveDto, @Req() req: any) {
    try {
      const res = await this.loveService.creatLove(params, req);
      return  { code: 200,  message: '操作成功',  success: true };
    } catch (e) {
      return  { code: 200, message: e.errorMessage,  success: false };
    }
  }

  /**
   * 取消喜欢
   * @param params
   */
  @Post('cancel')
  public async cancelLove(@Body('id') params: any, @Req() req: any) {
    try {
      const res = await this.loveService.cancelLove(params, req);
      return  { code: 200, message: '操作成功', success: true };
    } catch (e) {
      return  { code: 200, message: e.errorMessage,  success: false };
    }
  }

  /**
   * 查询喜欢列表
   * @param params
   */
  @Get('list')
  public async getList(@Query() params: QueryLoveDto) {
    try {
      const res = await this.loveService.getList(params);
      return  { code: 200, data: res, message: '查询成功',  success: true };
    } catch (e) {
      return  { code: 200, data: null, message: e.errorMessage,  success: false };
    }
  }
}
