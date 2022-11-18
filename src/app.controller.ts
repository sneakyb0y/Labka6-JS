import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { CommentsService } from './comments/comments.service';
import { PostService } from './posts/posts.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly postsService: PostService) {}

  @Get("/hello")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  @Render('index')
  async root() {
    const posts = await this.postsService.findAll(0, 10);
    return {
      meta: {
        title: "Page - Index",
        description: "Some description...",
        keywords: "Some keywords...",
        author: "Some author...",
      },
      message: 'Main page',
      posts
    }
  }

  @Get('/about')
  @Render('about')
  getAbout() { }
}
