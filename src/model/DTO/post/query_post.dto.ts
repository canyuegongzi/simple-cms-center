export class QueryPostDto {
  title: string;

  page: number;

  pageSize: number;

  tags: any;

  categoryId: number| string;

  isDelete: number;

  recommend: number;
}
