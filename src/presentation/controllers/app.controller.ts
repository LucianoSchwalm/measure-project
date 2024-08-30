import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MeasureService } from '../../domain/services/measure.service';
import { ImageBody } from '../dtos/UploadMeasure/image-body';
import { PatchConfirmBody } from '../dtos/PatchConfirmMeasure/confirm-body';

@Controller()
export class AppController {
  constructor(private measureService: MeasureService) {}

  @Post('upload')
  async uploadMeasureImage(@Body() body: ImageBody) {
    return await this.measureService.verifyMeasureByGemini(body);
  }

  @Get(':id/list')
  async getMeasureList(
    @Param('id') id: string,
    @Query('measure_type') type: string,
  ) {
    return await this.measureService.getMeasure(id, type);
  }

  @Patch('confirm')
  async patchConfirmMeasure(@Body() body: PatchConfirmBody) {
    await this.measureService.confirmMeasure(
      body.measure_uuid,
      body.confirmed_value,
    );
    return {
      success: true,
    };
  }
}
