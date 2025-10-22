import { IsNotEmpty, IsNumber } from 'class-validator';

export class FavoritesDto {
  @IsNumber()
  @IsNotEmpty()
  movieId: number;
}
