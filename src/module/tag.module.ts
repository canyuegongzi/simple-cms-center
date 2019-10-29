import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Post} from '../model/entity/post.entity';
import {Category} from '../model/entity/category.entity';
import {Tag} from '../model/entity/tag.entity';
import {TagController} from '../controller/tag.controller';
import {TagService} from '../service/service/tag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category, Tag]),
  ],
  controllers: [TagController],
  providers: [TagService],
  exports: [],
})
export class TagModule {}
