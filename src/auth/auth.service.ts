import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async generateToken(payload: any) {
    return this.jwtService.signAsync(payload);
  }

  async signIn(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const existingUser = await this.userService.findUserByEmail(user.email);
    if (!existingUser) {
      return this.registerUser(user);
    }
    return this.generateToken({
      sub: existingUser.id,
      email: existingUser.email,
    });
  }

  async registerUser(user) {
    try {
      const newUser = await this.userService.saveUser(user);

      return this.generateToken({
        sub: newUser.id,
        email: newUser.email,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
