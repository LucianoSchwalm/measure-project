import { GoogleAIFileManager } from '@google/generative-ai/server';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { ImageBody } from 'src/dtos/UploadMeasure/image-body';
import { MeasureRepository } from 'src/repositories/measure-repository';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { ImageResponse } from 'src/dtos/UploadMeasure/image-response';

@Injectable()
export class MeasureService {
  constructor(
    private configService: ConfigService,
    private measureRepository: MeasureRepository,
  ) {}

  startGeminiAcess() {
    const genAI = new GoogleGenerativeAI(
      this.configService.get('GEMINI_API_KEY'),
    );

    const fileManager = new GoogleAIFileManager(
      this.configService.get('GEMINI_API_KEY'),
    );

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
    });
    return { fileManager, model };
  }

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

  async verifyMeasureByGemini(body: ImageBody): Promise<ImageResponse> {
    const { image, customer_code, measure_type, measure_datetime } = body;
    const { model, fileManager } = this.startGeminiAcess();
    const measureDate = new Date(measure_datetime);

    const measures = await this.measureRepository.findMany(
      customer_code,
      measure_type,
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

    const imageBuffer = Buffer.from(image, 'base64');
    const imgName = `${customer_code.concat(measure_type, measureDate.toISOString().split('T')[0]).replaceAll('-', '')}`;
    const filePath = join('uploads', `${imgName}.jpg`);
    writeFileSync(filePath, imageBuffer);

    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: 'image/jpeg',
      displayName: imgName,
    });

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
