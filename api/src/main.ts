import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const serverConfig: any = config.get('server');
  const app = await NestFactory.create(AppModule);
  const port = serverConfig.port;

  app.enableCors({origin: process.env.ORIGIN || serverConfig.origin})
  

  await app.listen(process.env.PORT || port);
  logger.verbose(`CONNECTION SUCCESS: Server is listening on port ${process.env.PORT || port}.`);
}
bootstrap();