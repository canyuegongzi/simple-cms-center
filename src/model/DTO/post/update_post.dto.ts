import {IsEmail, IsInt, IsString, Min, Max, IsNumber, IsNotEmpty, IsArray} from 'class-validator';
import { ApiErrorCode } from '../../../config/api-error-code.enum';

export class UpdatePostDto {
    @IsNotEmpty({ message: '标题不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    title: string;

    @IsNotEmpty({ message: '标题不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    desc: any;

    @IsNotEmpty({ message: '文章id不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    id: number | number;

    @IsArray( {message: '标签格式错误', context: { errorCode: ApiErrorCode.USER_NAME_STRING }})
    tags: Array<string | number>;

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
