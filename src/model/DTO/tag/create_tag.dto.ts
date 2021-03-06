import {IsEmail, IsInt, IsString, Min, Max, IsNumber, IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/api-error-code.enum';

export class CreateTagDto {
  @IsNotEmpty({ message: '名称不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  name: string;

  @IsNotEmpty({ message: '描述不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  desc: any;

  @IsNotEmpty({ message: 'code不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
  code: string;
}
