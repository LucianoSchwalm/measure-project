import { GetMeasureResponse } from 'src/dtos/GetMeasure/get-measure-response';

export abstract class MeasureRepository {
  abstract create(): Promise<any>;
  abstract findMany(id: string, type: string): Promise<GetMeasureResponse>;
}
