import { forwardRef, Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { FavoritesService } from 'src/favorites/favorites.service';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  imports: [],
  providers: [MoviesService],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}
