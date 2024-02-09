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
import { createPollID, createUserID } from 'src/util/ids';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class PollService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createPoll(fields: CreatePollDto) {
    const adminId = createUserID();

    const newPoll = {
      pollId: createPollID(),
      topic: fields.topic,
      votesPerVoter: fields.votesPerVoter,
      adminId,
      participants: { [adminId]: fields.name },
    };
    try {
      const poll = await this.prisma.poll.create({ data: newPoll });
      const acessToken = await this.authService.signIn({
        name: fields.name,
        pollId: newPoll.pollId,
        userId: newPoll.adminId,
      });
      return {
        poll,
        acessToken,
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getPoll(pollId: string) {
    try {
      return this.prisma.poll.findFirst({
        where: {
          pollId,
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
          pollId: fields.pollId,
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
          pollId: fields.pollId,
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
