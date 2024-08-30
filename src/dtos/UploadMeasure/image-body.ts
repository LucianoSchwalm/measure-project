import { IsBase64, IsDate, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { MeasureType } from '../measure-type';
import { Transform } from 'class-transformer';

export class ImageBody {
  @IsNotEmpty()
  @IsBase64()
  image: string; //base64
  @IsNotEmpty()
  @IsString()
  customer_code: string;
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  measure_datetime: Date;
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  @IsIn(['WATER', 'GAS'])
  measure_type: MeasureType;
}
