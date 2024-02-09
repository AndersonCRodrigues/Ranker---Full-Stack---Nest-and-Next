import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from './constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstant.secret,
      signOptions: { expiresIn: jwtConstant.expiresIn },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
