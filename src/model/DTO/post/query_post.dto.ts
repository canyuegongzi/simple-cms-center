export class QueryPostDto {
  title: string;

  page: number;

  pageSize: number;

  tagId: any;

  categoryId: number| string;

  isDelete: number;

  recommend: number;

  startTime: string;

  endTime: string;
}
