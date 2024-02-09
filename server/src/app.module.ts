import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollModule } from './poll/poll.module';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PollModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
