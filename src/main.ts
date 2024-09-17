import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const logger = new Logger('HTTP');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Markdown Note Taking API')
    .setDescription('API for convert Markdown to HTML and check to grammar')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.useLogger(logger);
  app.use(cookieParser());
  app.enableCors({});
  SwaggerModule.setup('api/doc', app, document);
  await app.listen(3000);
}
bootstrap();
