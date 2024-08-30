import { GetMeasureResponse } from 'src/dtos/GetMeasure/get-measure-response';
import { PostMeasureData } from 'src/dtos/PostMeasure/post-measure-data';

export abstract class MeasureRepository {
  abstract findMany(id: string, type: string): Promise<GetMeasureResponse>;
  abstract create(body: PostMeasureData): Promise<any>;
  abstract updateConfirmation(
    measureUuid: string,
    confirmedValue: number,
  ): Promise<any>;
}
