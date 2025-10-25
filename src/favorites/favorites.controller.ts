import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { FavoritesDto } from './dto/favorites.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { MoviesService } from 'src/movies/movies.service';

@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly usersService: UsersService,
    private readonly moviesService: MoviesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  addFavorite(
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    @Body() movie: FavoritesDto,
  ) {
    return this.favoritesService.addFavorite(tokenPayload.sub, movie);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':movieId')
  removeFavorite(
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    @Param('movieId') movie: string,
  ) {
    const num = Number(movie);
    if (Number.isNaN(num))
      throw new BadRequestException('O id do filme precisa ser um número');
    return this.favoritesService.removeFavorite(tokenPayload.sub, num);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getFavorites(@TokenPayloadParam() token: TokenPayloadDto) {
    const favorites = await this.favoritesService.getFavorites(token.sub);
    const movies = await this.moviesService.getMoviesByIds(favorites);
    return movies;
  }

  @Get('public/:publicId')
  async getPublicFavorites(@Param('publicId') publicId: string) {
    const user = await this.usersService.getByPublicId(publicId);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const favorites = await this.favoritesService.getFavorites(user.id);
    const movies = await this.moviesService.getMoviesByIds(favorites);
    return {
      movies,
      name: user.name,
    };
  }
}
