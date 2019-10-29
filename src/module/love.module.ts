import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Post} from '../model/entity/post.entity';
import {Category} from '../model/entity/category.entity';
import {Tag} from '../model/entity/tag.entity';
import {Love} from '../model/entity/love.entity';
import {LoveController} from '../controller/love.controller';
import {LoveService} from '../service/service/love.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category, Tag, Love]),
  ],
  controllers: [LoveController],
  providers: [LoveService],
  exports: [],
})
export class LoveModule {}
