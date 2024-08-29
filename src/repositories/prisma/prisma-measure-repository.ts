import { PrismaService } from 'src/database/prisma.service';
import { MeasureRepository } from '../measure-repository';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaMeasureRepository implements MeasureRepository {
  constructor(private prisma: PrismaService) {}

  async create() {
    await this.prisma.image.create({
      data: {
        id: randomUUID(),
        url: 'teste',
        base64: 'teste',
      },
    });
  }
}
