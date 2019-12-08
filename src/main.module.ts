import { Module } from '@nestjs/common';
import { RedisModule} from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {redisConfig} from './config/config';
import {PostModule} from './module/post.module';
import {CategoryModule} from './module/category.module';
import {TagModule} from './module/tag.module';
import {CommentModule} from './module/comment.module';
import {LoveModule} from './module/love.module';
import {join} from 'path';

@Module({
  imports: [
    // RedisModule.register(redisConfig),
    TypeOrmModule.forRoot(
        {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '123456',
          database: 'b_simple_cms_center',
          entities: [join(__dirname, '**/**.entity{.ts,.js}')],
          synchronize: true,
        },
    ), PostModule, CategoryModule, TagModule, CommentModule, LoveModule ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class MainModule {}
