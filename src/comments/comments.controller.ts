import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment-dto';
import { UpdateCommentDto } from './dto/update-comment-dto';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get(':id')
    getById(@Param('id', new ParseIntPipe()) id: number) {
        return this.commentsService.findById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    create(@Body() body: CreateCommentDto, @Req() req: any) {
        const username: string = req.user.username;
        return this.commentsService.create(body, username);
    }

    @Put(':id')
    @HttpCode(HttpStatus.ACCEPTED)
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id', new ParseIntPipe()) id: number,
        @Body() body: UpdateCommentDto,
        @Req() req: any
    ) {
        const username: string = req.user.username;
        return this.commentsService.update(id, body, username);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    delete(@Param('id', new ParseIntPipe()) id: number, @Req() req: any) {
        const username: string = req.user.username;
        return this.commentsService.delete(id, username);
    }
}
