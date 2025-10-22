import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';
import { FavoritesModule } from './favorites/favorites.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), MoviesModule, FavoritesModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
