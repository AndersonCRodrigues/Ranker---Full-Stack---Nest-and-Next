import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authSignIn } from './types';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(fields: authSignIn) {
    const payload = {
      sub: fields.userId,
      pollId: fields.pollId,
      name: fields.name,
    };
    return this.jwtService.signAsync(payload);
  }
}
