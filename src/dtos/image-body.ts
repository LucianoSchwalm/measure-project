import { IsNotEmpty } from 'class-validator';

type MeasureType = 'water' | 'gas';

export class ImageBody {
  @IsNotEmpty()
  image: string; //base64
  @IsNotEmpty()
  customer_code: string;
  @IsNotEmpty()
  measure_datetime: Date;
  @IsNotEmpty()
  measure_type: MeasureType;
}
