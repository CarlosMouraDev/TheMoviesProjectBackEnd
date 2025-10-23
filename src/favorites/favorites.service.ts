import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { FavoritesDto } from './dto/favorites.dto';

const prisma = new PrismaClient();

@Injectable()
export class FavoritesService {
  async addFavorite(userId: number, movieId: FavoritesDto) {
    const alreadyIn = (await this.getFavorites(userId)).filter(
      (id) => id === Number(movieId.movieId),
    );

    if (alreadyIn.length >= 1)
      throw new ConflictException('Filme já favoritado');

    const mId = Number(movieId.movieId);
    return prisma.favorite.create({
      data: { userId, movieId: mId },
    });
  }

  async removeFavorite(userId: number, movieId: number) {
    const deleted = await prisma.favorite.deleteMany({
      where: { userId, movieId },
    });

    if (deleted.count === 0) {
      throw new NotFoundException('Esse filme não está nos favoritos.');
    }

    return { message: 'Filme excluído dos favoritos', status: 200 };
  }

  async getFavorites(userId: number) {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { movieId: true },
    });
    return favorites.map((f) => f.movieId);
  }
}
