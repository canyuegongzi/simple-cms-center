import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Post} from '../model/entity/post.entity';
import {PostService} from '../service/service/post.service';
import {PostController} from '../controller/post.controller';
import {Category} from '../model/entity/category.entity';
import {Tag} from '../model/entity/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category, Tag]),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [],
})
export class PostModule {}
