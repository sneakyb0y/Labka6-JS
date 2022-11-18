import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/comments/comments.entity';
import { Paginated } from 'src/utils/pagination/paginated';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './posts.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Posts)
        private readonly postsRepository: Repository<Posts>,

        @InjectRepository(Comments)
        private readonly commentsRepository: Repository<Comments>,
    ) {}

    async findAll(page: number, size: number) {
        const skip = page * size;
        const [posts, count] = await this.postsRepository.findAndCount({
            skip: skip,
            take: size,
        });

        const pages = Math.ceil(count / size);
        return new Paginated<Posts>(posts, count, pages, page);
    }

    async findById(id: number) {
        const post = await this.postsRepository.findOneBy({ id: id });

        if (!post) {
            throw new HttpException(
                `Post with given id = ${id} not found!`,
                HttpStatus.NOT_FOUND,
            );
        }

        return post;
    }

    async getAllComments(id: number, page: number, size: number) {
        const skip = page * size;
        const [comments, count] = await this.commentsRepository.findAndCount({
            skip: skip,
            take: size,
            where: {
                post: {
                    id: id,
                },
            }
        });

        const pages = Math.ceil(count / size);
        return new Paginated<Comments>(comments, count, pages, page);
    }

    create(createDTO: CreatePostDto, username: string) {
        const post = this.postsRepository.create({
            ...createDTO,
            createdBy: username
        });
        return this.postsRepository.save(post);
    }

    async update(id: number, updateDTO: UpdatePostDto, username: string) {
        const post = await this.postsRepository.findOneBy({ id: id });

        if (!post) {
            throw new HttpException(
                `Post with given id = ${id} not found!`,
                HttpStatus.NOT_FOUND,
            );
        }

        if (post.createdBy !== username) {
            throw new HttpException(
                `Cannot update alien post`,
                HttpStatus.NOT_FOUND,
            );
        }

        return this.postsRepository.save({
            ...post,
            ...updateDTO,
            updatedAt: new Date().toISOString(),
        });
    }

    async delete(id: number, username: string) {
        const post = await this.postsRepository.findOneBy({ id: id });

        if (!post) {
            return;
        }

        if (post.createdBy !== username) {
            throw new HttpException(
                `Cannot delete alien post`,
                HttpStatus.NOT_FOUND,
            );
        }
        
        await this.postsRepository.delete({ id: id });
    }
}
