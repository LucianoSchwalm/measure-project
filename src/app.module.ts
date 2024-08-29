import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './database/prisma.service';
import { MeasureRepository } from './repositories/measure-repository';
import { PrismaMeasureRepository } from './repositories/prisma/prisma-measure-repository';
import { MeasureService } from './services/measure.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [
    PrismaService,
    { provide: MeasureRepository, useClass: PrismaMeasureRepository },
    MeasureService,
  ],
})
export class AppModule {}
