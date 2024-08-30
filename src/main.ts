import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        if (errors.length > 1) {
          const result = errors.map((error) => ({
            error_code: 'INVALID_DATA',
            error: error.constraints[Object.keys(error.constraints)[0]],
          }));
          return new HttpException(result, 400);
        } else {
          {
            const result = {
              error_code: 'INVALID_DATA',
              error:
                errors[0].constraints[Object.keys(errors[0].constraints)[0]],
            };
            return new HttpException(result, 400);
          }
        }
      },
    }),
  );
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(3000);
}
bootstrap();
