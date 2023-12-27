import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  CreatePollDto,
  AddParticipantDto,
  RemoveParticipantDto,
} from './poll.dto';
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
    try {
      return this.prisma.poll.findUnique({
        where: {
          id: pollId,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addParticipant(fields: AddParticipantDto) {
    const userId = createUserID();
    const participant = { [userId]: fields.name };

    try {
      const poll = await this.getPoll(fields.pollId);

      poll.participants = Object.assign(poll.participants, participant);

      return this.prisma.poll.update({
        where: {
          id: fields.pollId,
        },
        data: {
          participants: poll.participants,
        },
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async removeParticipant(fields: RemoveParticipantDto) {
    try {
      const poll = await this.getPoll(fields.pollId);
      delete poll.participants[fields.userId];

      await this.prisma.poll.update({
        where: {
          id: fields.pollId,
        },
        data: {
          participants: poll.participants,
        },
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
