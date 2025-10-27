import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { HashingService } from 'src/common/hashing/hashing.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService,
  ) {}

  // Log in the user if email and password are correct
  async login(loginDto: LoginDto) {
    const user = await this.usersService.getByEmail(loginDto.email);
    const error = new UnauthorizedException('Email ou senha inválidos.');

    if (!user) {
      throw error;
    }

    const isPasswordValid = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw error;
    }

    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get('jwt.secret'),
      audience: this.configService.get('jwt.audience'),
      issuer: this.configService.get('jwt.issuer'),
      expiresIn: `${this.configService.get('jwt.jwtTtl')}s`,
    });

    return { accessToken, name: user.name };
  }
}
