import {IsEmail, IsInt, IsString, Min, Max, IsNumber, IsNotEmpty, IsArray} from 'class-validator';
import { ApiErrorCode } from '../../../config/api-error-code.enum';

export class UpdateCommentDto {
    @IsNotEmpty({ message: '内容不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    content: any;

    @IsNotEmpty({ message: '文章id不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    id: any;

    time: any;

    @IsNotEmpty({ message: '文章不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    postId: number;
}
