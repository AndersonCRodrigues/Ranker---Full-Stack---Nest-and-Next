import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    await this.$runCommandRaw({
      createIndexes: 'poll',
      indexes: [
        {
          key: {
            createdAt: 1,
          },
          name: 'createdAt_ttl_index',
          expireAfterSeconds: 1800,
        },
      ],
    });
  }
}
