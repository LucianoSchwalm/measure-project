import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ImageBody } from 'src/presentation/dtos/UploadMeasure/image-body';
import { MeasureRepository } from 'src/domain/repositories/measure-repository';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { ImageResponse } from 'src/presentation/dtos/UploadMeasure/image-response';
import { ApiRepository } from '../repositories/api-repository';

@Injectable()
export class MeasureService {
  constructor(
    private measureRepository: MeasureRepository,
    private apiRepository: ApiRepository,
  ) {}

  async getMeasure(id: string, type: string) {
    if (type.toUpperCase() !== 'WATER' && type.toUpperCase() !== 'GAS') {
      throw new HttpException(
        {
          error_code: 'INVALID_TYPE',
          error: 'Tipo de medição não permitida',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.measureRepository.findMany(id, type);
  }

  async confirmMeasure(measureUuid: string, confirmedValue: number) {
    return await this.measureRepository.updateConfirmation(
      measureUuid,
      confirmedValue,
    );
  }

  async verifySameMonth(
    customerCode: string,
    measureType: string,
    measureDate: Date,
  ) {
    const measures = await this.measureRepository.findMany(
      customerCode,
      measureType,
    );

    const measureSameMonth = measures.measures.find(
      (dbMeasure) =>
        dbMeasure.measure_datetime.getMonth() === measureDate.getMonth(),
    );
    if (measureSameMonth) {
      throw new HttpException(
        { error_code: 'DOUBLE_REPORT', erro: 'Leitura do mês já realizada' },
        HttpStatus.CONFLICT,
      );
    }
  }

  async uploadImageWithApi(image: string, fileManager: any) {
    const imageBuffer = Buffer.from(image, 'base64');
    const imgName = 'file';
    const filePath = join('uploads', `${imgName}.jpg`);
    writeFileSync(filePath, imageBuffer);
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: 'image/jpeg',
      displayName: imgName,
    });
    return uploadResponse;
  }

  async verifyMeasureByGemini(body: ImageBody): Promise<ImageResponse> {
    const { image, customer_code, measure_type, measure_datetime } = body;
    const { model, fileManager } = this.apiRepository.apiConnection();
    const measureDate = new Date(measure_datetime);

    this.verifySameMonth(customer_code, measure_type, measureDate);

    const uploadResponse = await this.uploadImageWithApi(image, fileManager);

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      {
        text: 'Qual o valor total da conta? Responda somente com o valor numérico. Exemplo de resposta: 42.15',
      },
    ]);

    const measureValue = parseFloat(result.response.text());
    const id = randomUUID();

    await this.measureRepository.create({
      id,
      datetime: measureDate,
      hasConfirmed: false,
      value: measureValue,
      type: measure_type,
      imageUrl: uploadResponse.file.uri,
      customerId: customer_code,
    });

    return {
      image_url: uploadResponse.file.uri,
      measure_value: measureValue,
      measure_uuid: id,
    };
  }
}
