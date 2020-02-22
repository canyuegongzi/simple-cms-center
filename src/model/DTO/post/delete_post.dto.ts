import {IsNotEmpty, IsString} from 'class-validator';
import {ApiErrorCode} from '../../../config/api-error-code.enum';

export class DeletePostDto {
    @IsNotEmpty({ message: '文章id不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    id: Array<number | string>;
}
