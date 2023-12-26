import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePollDto } from './poll.dto';
import { createUserID } from 'src/ids';

@Injectable()
export class PollService {
  constructor(private prisma: PrismaService) {}

  // private async createTTLIndex(): Promise<void> {
  //   try {
  //     await this.prisma.$runCommandRaw({
  //       createIndexes: 'Poll',
  //       indexes: [
  //         {
  //           key: {
  //             createdAt: 1,
  //           },
  //           name: 'createdAt_ttl_index',
  //           expireAfterSeconds: 3600,
  //         },
  //       ],
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  async createPoll(fields: CreatePollDto) {
    const newPoll = {
      topic: fields.topic,
      votesPerVoter: fields.votesPerVoter,
      adminId: createUserID(),
    };

    // await this.createTTLIndex();
    return this.prisma.poll.create({ data: newPoll });
  }
}
