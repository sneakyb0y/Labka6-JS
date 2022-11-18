import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';
import { root } from './utils/paths';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostService } from './posts/posts.service';
import { CommentsService } from './comments/comments.service';
import { Posts } from './posts/posts.entity';
import { Comments } from './comments/comments.entity';
import {User} from './user/user.entity';
import { AdminModule } from '@adminjs/nestjs';
import AdminJS from 'adminjs';
import { Resource, Database } from '@adminjs/typeorm';
import { DataSource } from 'typeorm';

AdminJS.registerAdapter({ Resource, Database });

const DEFAULT_ADMIN = {
  email: 'admin@mail.com',
  password: 'qwerty',
}

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities,
      logging: true,
      type: 'sqlite',
      synchronize: true,
      database: `${root}/db/db.db`,
    }),
    TypeOrmModule.forFeature([Comments, Posts]),
    AuthModule,
    CommentsModule,
    PostModule,
    UserModule,
    AdminModule.createAdminAsync({
      useFactory: () => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [Comments, Posts, User],
        },
        auth: {
          authenticate,
          cookieName: 'adminjs',
          cookiePassword: 'secret'
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: 'secret'
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PostService],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
