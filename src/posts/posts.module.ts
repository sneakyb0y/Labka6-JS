import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from 'src/comments/comments.entity';
import { CommentsService } from 'src/comments/comments.service';
import { User } from 'src/user/user.entity';
import { PostsController } from './posts.controller';
import { Posts } from './posts.entity';
import { PostService } from './posts.service';

@Module({
    imports: [TypeOrmModule.forFeature([Comments, Posts, User])],
    controllers: [PostsController],
    providers: [PostService, CommentsService],
})
export class PostModule {}
