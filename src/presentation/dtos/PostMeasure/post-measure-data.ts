import { MeasureType } from '../measure-type';

export class PostMeasureData {
  id: string;
  customerId: string;
  datetime: Date;
  hasConfirmed: boolean;
  value: number;
  imageUrl: string;
  type: MeasureType;
}
