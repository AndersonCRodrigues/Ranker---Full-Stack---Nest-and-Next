import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto, AddParticipantDto } from './poll.dto';

@UsePipes(new ValidationPipe())
@Controller('poll')
export class PollController {
  constructor(private pollService: PollService) {}

  @Post()
  async create(@Body() createPollDto: CreatePollDto) {
    return this.pollService.createPoll(createPollDto);
  }

  @Post('/join')
  async join(@Body() addParticipantDto: AddParticipantDto) {
    return this.pollService.addParticipant(addParticipantDto);
  }
}
