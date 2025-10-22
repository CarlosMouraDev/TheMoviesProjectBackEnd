import { IsOptional, IsString } from 'class-validator';

export class SearchMoviesDto {
  @IsString()
  query: string;

  @IsOptional()
  page?: number;
}
