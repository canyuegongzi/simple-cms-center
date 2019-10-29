import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Post} from '../model/entity/post.entity';
import {Category} from '../model/entity/category.entity';
import {Tag} from '../model/entity/tag.entity';
import {CategoryController} from '../controller/category.controller';
import {CategoryService} from '../service/service/category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category, Tag]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [],
})
export class CategoryModule {}
