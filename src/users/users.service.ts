import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hashing.service';
import { PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  constructor(private readonly hashingService: HashingService) {}

  async createUser(createUserDto: CreateUserDto) {
    const hashed = await this.hashingService.hash(createUserDto.password);
    return prisma.user.create({
      data: { ...createUserDto, password: hashed },
    });
  }

  async getByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }
}
