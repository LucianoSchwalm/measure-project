import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PatchConfirmBody {
  @IsNotEmpty()
  @IsString()
  measure_uuid: string;
  @IsNotEmpty()
  @IsNumber()
  confirmed_value: number;
}
