import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { FavoritesDto } from './dto/favorites.dto';

const prisma = new PrismaClient();

@Injectable()
export class FavoritesService {
  async addFavorite(userId: number, movieId: FavoritesDto) {
    const mId = Number(movieId.movieId);
    return prisma.favorite.create({
      data: { userId, movieId: mId },
    });
  }

  async removeFavorite(userId: number, movieId: FavoritesDto) {
    const mId = Number(movieId.movieId);
    return prisma.favorite.deleteMany({
      where: { userId, movieId: mId },
    });
  }
}
