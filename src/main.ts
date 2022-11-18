import * as hbs from 'hbs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'src/views/partials'));

  hbs.registerHelper('check', function(value: any, comparator: any, options) {
    if(value === comparator) {
      return options.fn(this);
    }
    else {
      return options.inverse(this);
    }
  });

  hbs.registerHelper('checkArray', function(value: [], options) {
    if(value.length > 0) {
      return options.fn(this);
    }
    else {
      return options.inverse(this);
    }
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
