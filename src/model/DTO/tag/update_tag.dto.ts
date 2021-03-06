import {IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/api-error-code.enum';

export class UpdateTagDto {
    @IsNotEmpty({ message: '名称不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    name: string;

    @IsNotEmpty({ message: '标题不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    desc: any;

    @IsNotEmpty({ message: 'id不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    id: any;

    @IsNotEmpty({ message: 'code不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    code: any;

}
