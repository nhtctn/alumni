import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'node:path';
import * as hbs from 'hbs';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setViewEngine('hbs');
  app.engine('hbs', hbs.__express);
  hbs.registerHelper('initial', (name: string) =>
    name.trim().charAt(0).toUpperCase(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Alumni Istanbul API')
    .setDescription('API for connecting Istanbul University alumni and students.')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/swagger', app, swaggerDocument, {
    jsonDocumentUrl: 'api/swagger-json',
  });
  await app.listen(3000, '0.0.0.0');
}

void bootstrap();
