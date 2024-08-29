import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { ImageBody } from 'src/dtos/image-body';

@Injectable()
export class MeasureService {
  constructor(private configService: ConfigService) {}

  async getMeasureByGemini(body: ImageBody) {
    const genAI = new GoogleGenerativeAI(
      this.configService.get('GEMINI_API_KEY'),
    );

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
    });

    const imageBuffer = Buffer.from(body.image, 'base64').toString('base64');

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
}
