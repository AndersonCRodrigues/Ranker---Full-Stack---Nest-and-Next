import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePollDto } from './poll.dto';
import { createUserID } from 'src/ids';

@Injectable()
export class PollService {
  constructor(private prisma: PrismaService) {}

  async createPoll(fields: CreatePollDto) {
    const newPoll = {
      topic: fields.topic,
      votesPerVoter: fields.votesPerVoter,
      adminId: createUserID(),
    };

    return this.prisma.poll.create({ data: newPoll });
  }
}
