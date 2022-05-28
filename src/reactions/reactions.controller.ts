import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { ReactionsPagination } from './interfaces/reactions.interfaces';

@Controller()
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @MessagePattern({ role: 'reaction', cmd: 'create' })
  create(@Payload() createReactionDto: CreateReactionDto) {
    return this.reactionsService.addReaction(createReactionDto);
  }

  @MessagePattern({ role: 'reaction', cmd: 'findPostReactions' })
  findAll(@Payload() pagination: ReactionsPagination) {
    return this.reactionsService.findPostReactions(pagination);
  }
}
