import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';
import { FavoritesModule } from './favorites/favorites.module';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), MoviesModule, FavoritesModule, UsersModule, AuthModule],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
