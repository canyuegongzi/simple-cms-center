import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Post} from '../model/entity/post.entity';
import {Category} from '../model/entity/category.entity';
import {Tag} from '../model/entity/tag.entity';
import {CommentService} from '../service/service/comment.service';
import {CommentController} from '../controller/comment.controller';
import {Comment} from '../model/entity/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category, Tag, Comment]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [],
})
export class CommentModule {}
