import { PrismaService } from 'src/database/prisma.service';
import { MeasureRepository } from '../measure-repository';
// import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { GetMeasureResponse } from 'src/dtos/GetMeasure/get-measure-response';

@Injectable()
export class PrismaMeasureRepository implements MeasureRepository {
  constructor(private prisma: PrismaService) {}
  async findMany(id: string, type?: string): Promise<GetMeasureResponse> {
    if (type) {
      const withType = await this.prisma.measure.findMany({
        where: {
          customerId: id,
          type: type,
        },
      });
      return {
        customerCode: id,
        measures: withType.map((oneMeasure) => {
          return {
            measure_uuid: oneMeasure.id,
            measure_datetime: oneMeasure.datetime,
            measure_type: oneMeasure.type,
            has_confirmed: oneMeasure.hasConfirmed,
            image_url: oneMeasure.imageUrl,
          };
        }),
      };
    }
    const withoutType = await this.prisma.measure.findMany({
      where: {
        customerId: id,
      },
    });
    return {
      customerCode: id,
      measures: withoutType.map((oneMeasure) => {
        return {
          measure_uuid: oneMeasure.id,
          measure_datetime: oneMeasure.datetime,
          measure_type: oneMeasure.type,
          has_confirmed: oneMeasure.hasConfirmed,
          image_url: oneMeasure.imageUrl,
        };
      }),
    };
  }

  async create() {
    return 'teste';
  }
}
