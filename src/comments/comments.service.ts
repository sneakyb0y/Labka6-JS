import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/posts/posts.entity';
import { Repository } from 'typeorm';
import { Comments } from './comments.entity';
import { CreateCommentDto } from './dto/create-comment-dto';
import { UpdateCommentDto } from './dto/update-comment-dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comments)
        private readonly commentsRepository: Repository<Comments>,

        @InjectRepository(Posts)
        private readonly postsRepository: Repository<Posts>,
    ) {}

    async findById(id: number) {
        const comment = await this.commentsRepository.findOneBy({ id: id });

        if (!comment) {
            throw new HttpException(
                `Comment with given id = ${id} not found!`,
                HttpStatus.NOT_FOUND,
            );
        }

        return comment;
    }

    async create(createDTO: CreateCommentDto, username: string) {
        const post = await this.postsRepository.findOneBy({
            id: createDTO.postId,
        });

        if (!post) {
            throw new HttpException(
                `Post with given id = ${createDTO.postId} not found!`,
                HttpStatus.NOT_FOUND,
            );
        }

        const comment = this.commentsRepository.create({
            post: { id: createDTO.postId },
            text: createDTO.text,
            createdBy: username
        });

        return this.commentsRepository.save(comment);
    }

    async update(id: number, updateDTO: UpdateCommentDto, username: string) {
        const comment = await this.commentsRepository.findOneBy({ id: id });
        if (!comment) {
            throw new HttpException(
                `Comment with given id = ${id} not found!`,
                HttpStatus.NOT_FOUND,
            );
        }

        if (comment.createdBy !== username) {
            throw new HttpException(
                `Cannot update alien comment`,
                HttpStatus.NOT_FOUND,
            );
        }

        return this.commentsRepository.save({
            ...comment,
            ...updateDTO,
            updatedAt: new Date().toISOString(),
        });
    }

    async delete(id: number, username: string) {
        const comment = await this.commentsRepository.findOneBy({ id: id });
        if (!comment) {
            return;
        }

        if (comment.createdBy !== username) {
            throw new HttpException(
                `Cannot delete alien comment`,
                HttpStatus.NOT_FOUND,
            );
        }

        await this.commentsRepository.delete({ id: id });
    }
}
