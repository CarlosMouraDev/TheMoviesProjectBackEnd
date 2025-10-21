import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SearchMoviesDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;
}
