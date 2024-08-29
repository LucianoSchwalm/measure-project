import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { ImageBody } from 'src/dtos/image-body';
import { MeasureRepository } from 'src/repositories/measure-repository';

@Injectable()
export class MeasureService {
  constructor(
    private configService: ConfigService,
    private measureRepository: MeasureRepository,
  ) {}

  async verifyMeasureByGemini(body: ImageBody) {
    const { image, customer_code, measure_type, measure_datetime } = body;

    const genAI = new GoogleGenerativeAI(
      this.configService.get('GEMINI_API_KEY'),
    );

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
    });

    const measures = await this.measureRepository.findMany(
      customer_code,
      measure_type,
    );

    let alreadyRead = false;

    measures.measures.map((dbMeasure) => {
      if (
        dbMeasure.measure_datetime.getMonth() === measure_datetime.getMonth()
      ) {
        alreadyRead = true;
      }
    });

    if (alreadyRead) {
      return { message: 'This month already has a measurement reading' };
    }

    const imageBuffer = Buffer.from(image, 'base64').toString('base64');

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBuffer,
        },
      },
      {
        text: 'Qual o valor total da conta?',
      },
    ]);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }

  async getMeasure(id: string, type: string) {
    await this.measureRepository.findMany(id, type);
  }
}
