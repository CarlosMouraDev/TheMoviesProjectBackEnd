import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { SearchMoviesDto } from './dto/movies.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  search(@Query() query: SearchMoviesDto) {
    return this.moviesService.searchMovies(query.query, query.page);
  }

  @Get('popular')
  async getPopularMovies(@Query('page') page?: number) {
    return this.moviesService.getPopularMovies(page);
  }

  @Get(':id')
  getDetails(@Param('id') id: string) {
    const idNum = Number(id);
    if (Number.isNaN(idNum))
      throw new NotFoundException('Filme não encontrado');
    return this.moviesService.getMovieDetails(idNum);
  }
}
