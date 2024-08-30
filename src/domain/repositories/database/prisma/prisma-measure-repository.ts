import { PrismaService } from 'src/domain/services/prisma.service';
import { MeasureRepository } from '../../measure-repository';
// import { randomUUID } from 'node:crypto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetMeasureResponse } from 'src/presentation/dtos/GetMeasure/get-measure-response';
import { PostMeasureData } from 'src/presentation/dtos/PostMeasure/post-measure-data';

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
      if (!withType) {
        throw new HttpException(
          {
            error_code: 'MEASURES_NOT_FOUND',
            error: 'Nenhuma leitura encontrada',
          },
          HttpStatus.NOT_FOUND,
        );
      }
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

  async updateConfirmation(
    measureUuid: string,
    confirmedValue: number,
  ): Promise<any> {
    const measure = await this.prisma.measure.findUnique({
      where: {
        id: measureUuid,
      },
    });
    if (!measure) {
      throw new HttpException(
        {
          error_code: 'MEASURES_NOT_FOUND',
          error: 'Leitura do mês já realizada',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (measure.hasConfirmed) {
      throw new HttpException(
        {
          error_code: 'CONFIRMATION_DUPLICATE',
          error: 'Leitura do mês já realizada',
        },
        HttpStatus.CONFLICT,
      );
    }

    return await this.prisma.measure.update({
      where: {
        id: measureUuid,
      },
      data: {
        hasConfirmed: true,
        value: confirmedValue,
      },
    });
  }

  async create(body: PostMeasureData) {
    return await this.prisma.measure.create({
      data: {
        id: body.id,
        customerId: body.customerId,
        datetime: body.datetime,
        hasConfirmed: body.hasConfirmed,
        imageUrl: body.imageUrl,
        type: body.type,
        value: body.value,
      },
    });
  }
}
