import { Module } from '@nestjs/common';
import { AppController } from '../presentation/controllers/app.controller';
import { PrismaService } from '../domain/services/prisma.service';
import { MeasureRepository } from '../domain/repositories/measure-repository';
import { PrismaMeasureRepository } from '../domain/repositories/database/prisma/prisma-measure-repository';
import { MeasureService } from '../domain/services/measure.service';
import { ConfigModule } from '@nestjs/config';
import { ApiRepository } from 'src/domain/repositories/api-repository';
import { GeminiRepository } from 'src/domain/repositories/api/gemini-repository';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [
    PrismaService,
    { provide: MeasureRepository, useClass: PrismaMeasureRepository },
    { provide: ApiRepository, useClass: GeminiRepository },
    MeasureService,
  ],
})
export class AppModule {}
