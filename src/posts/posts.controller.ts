import {
    Controller,
    Get,
    Param,
    Post,
    Put,
    Delete,
    Body,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    Query,
    DefaultValuePipe,
    UseGuards,
    Render,
    Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostService) {}

    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(0), new ParseIntPipe())
        page: number,
        @Query('size', new DefaultValuePipe(10), new ParseIntPipe())
        size: number,
    ) {
        return this.postsService.findAll(page, size);
    }

    @Get(':postId/comments')
    getAllComments(
        @Param('postId', new ParseIntPipe()) postId: number,
        @Query('page', new DefaultValuePipe(0), new ParseIntPipe())
        page: number,
        @Query('size', new DefaultValuePipe(10), new ParseIntPipe())
        size: number,
    ) {
        return this.postsService.getAllComments(postId, page, size);
    }

    @Get(':id')
    @Render('post')
    async getById(@Param('id', new ParseIntPipe()) id: number) {
        const post = await this.postsService.findById(id);
        const comments = (await this.getAllComments(post.id, 0, 10)).items;
        return {
            meta:{
                title: post.title,
                description: post.description,
                keywords: 'post'
            },
            message: 'Post page',
            post,
            comments
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    create(@Body() body: CreatePostDto, @Req() req: any) {
        let username = req.user.username;
        return this.postsService.create(body, username);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.ACCEPTED)
    update(
        @Param('id', new ParseIntPipe()) id: number,
        @Body() body: UpdatePostDto,
        @Req() req: any
    ) {
        let username = req.user.username;
        return this.postsService.update(id, body, username);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    delete(@Param('id', new ParseIntPipe()) id: number, @Req() req: any) {
        let username = req.user.username;
        return this.postsService.delete(id, username);
    }
}
