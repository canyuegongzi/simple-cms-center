import { IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/api-error-code.enum';

export class CreateLoveDto {

  @IsNotEmpty({ message: '用户信息不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  userId: any;

  @IsNotEmpty({ message: '时间不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  time: any;

  @IsNotEmpty({ message: '用户信息不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  userName: any;

  @IsNotEmpty({ message: '类型不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  type: number;

  email: string;

  city: string;

  province: string;

  address: string;

  browser: string;

  system: string;

  @IsNotEmpty({ message: '文章不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  postId: any;

  loveIp: string;
}
