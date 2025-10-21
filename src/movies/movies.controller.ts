import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { SearchMoviesDto } from './dto/movies.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  search(@Query() query: SearchMoviesDto) {
    return this.moviesService.searchMovies(query.query, query.page);
  }
}
