import { forwardRef, Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    AuthModule,
    forwardRef(() => MoviesModule),
  ],
  providers: [FavoritesService],
  controllers: [FavoritesController],
  exports: [FavoritesService],
})
export class FavoritesModule {}
