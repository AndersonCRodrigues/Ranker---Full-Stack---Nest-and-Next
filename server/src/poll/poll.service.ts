import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePollDto, JoinPollDto } from './poll.dto';
import { createUserID } from 'src/util/ids';

@Injectable()
export class PollService {
  constructor(private prisma: PrismaService) {}

  async createPoll(fields: CreatePollDto) {
    const adminId = createUserID();

    const newPoll = {
      topic: fields.topic,
      votesPerVoter: fields.votesPerVoter,
      adminId,
      participants: { [adminId]: fields.name },
    };

    return this.prisma.poll.create({ data: newPoll });
  }

  async getPoll(pollId: string) {
    return this.prisma.poll.findUnique({
      where: {
        id: pollId,
      },
    });
  }

  async joinPoll(fields: JoinPollDto) {
    const userId = createUserID();
    const poll = await this.getPoll(fields.pollId);
    const participant = { [userId]: fields.name };

    poll.participants = Object.assign(poll.participants, participant);

    return this.prisma.poll.update({
      where: {
        id: fields.pollId,
      },
      data: {
        participants: poll.participants,
      },
    });
  }
}
