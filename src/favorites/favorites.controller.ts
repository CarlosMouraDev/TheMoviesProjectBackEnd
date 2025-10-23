import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { FavoritesDto } from './dto/favorites.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

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
    @Param('movieId') movie: FavoritesDto,
  ) {
    return this.favoritesService.removeFavorite(tokenPayload.sub, movie);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getFavorites(@TokenPayloadParam() token: TokenPayloadDto) {
    return this.favoritesService.getFavorites(token.sub);
  }
}
