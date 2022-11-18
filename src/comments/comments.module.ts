import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/posts/posts.entity';
import { User } from 'src/user/user.entity';
import { CommentsController } from './comments.controller';
import { Comments } from './comments.entity';
import { CommentsService } from './comments.service';

@Module({
    imports: [TypeOrmModule.forFeature([Comments, Posts, User])],
    controllers: [CommentsController],
    providers: [CommentsService],
})
export class CommentsModule {}
