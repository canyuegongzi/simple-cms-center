import {IsEmail, IsInt, IsString, Min, Max, IsNumber, IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/api-error-code.enum';

export class CreatePostDto {
  @IsNotEmpty({ message: '标题不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  title: string;

  @IsNotEmpty({ message: '标题不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  desc: any;

  // @ts-ignore
  // @IsNumber({allowNaN: false, allowInfinity: false }, {message: '标签格式错误', context: { errorCode: ApiErrorCode.USER_NAME_STRING }})
  tags: Array<string | number>;

  @IsNotEmpty({ message: '内容不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  content: any;

  contentMd: any;

  time: any;

  userId: any;

  @IsNotEmpty({ message: '封面不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  linkImg: string;

  @IsNotEmpty({ message: '推荐不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  recommend: number;

  @IsNotEmpty({ message: '分类不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  categoryId: number | string;
}
