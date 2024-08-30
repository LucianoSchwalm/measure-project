import { Injectable } from '@nestjs/common';
import { ApiRepository } from '../api-repository';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/dist/server/server';

@Injectable()
export class GeminiRepository implements ApiRepository {
  configService: any;
  apiConnection(): any {
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
}
