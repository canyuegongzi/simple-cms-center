import {IsEmail, IsInt, IsString, Min, Max, IsNumber, IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/api-error-code.enum';

export class CreateCommentDto {

  @IsNotEmpty({ message: '内容不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  content: any;

  time: any;

  userId: any;

  parentId: number;

  @IsNotEmpty({ message: '作者名不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  userName: string;

  email: string;

  @IsNotEmpty({ message: '文章不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  postId: number;

}
