import { Body, Controller, Post } from '@nestjs/common';
import { MeasureRepository } from './repositories/measure-repository';
import { MeasureService } from './services/measure.service';
import { ImageBody } from './dtos/image-body';

@Controller()
export class AppController {
  constructor(
    private measureRepository: MeasureRepository,
    private measureService: MeasureService,
  ) {}

  @Post('upload')
  async uploadMeasureImage(@Body() body: ImageBody) {
    await this.measureService.getMeasureByGemini(body);
    // await this.measureRepository.create();

    return {
      image_url: 'teste',
      measure_value: 2,
      measure_uuid: 'dksajd',
    };
  }
}
