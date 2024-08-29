import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MeasureService } from './services/measure.service';
import { ImageBody } from './dtos/image-body';

@Controller()
export class AppController {
  constructor(private measureService: MeasureService) {}

  @Post('upload')
  async uploadMeasureImage(@Body() body: ImageBody) {
    await this.measureService.verifyMeasureByGemini(body);
    // await this.measureRepository.create();

    return {
      image_url: 'teste',
      measure_value: 2,
      measure_uuid: 'dksajd',
    };
  }
  @Get(':id/list')
  async getMeasureList(
    @Param('id') id: string,
    @Query('measure_type') type: string,
  ) {
    await this.measureService.getMeasure(id, type);
  }
}
