import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { lastValueFrom, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { Reaction } from './entities/reaction.entity';
import { ReactionType } from './enums/reactions.enums';
import {
  Reactions,
  ReactionsPagination,
} from './interfaces/reactions.interfaces';

const logger = new Logger('ReactionsService');

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
    private httpService: HttpService,
  ) {}

  async addReaction(createReactionDto: CreateReactionDto): Promise<Reaction> {
    try {
      const reaction = await this.reactionRepository.findOne({
        where: {
          postId: createReactionDto.postId,
          userId: createReactionDto.userId,
        },
      });
      if (reaction) {
        if (createReactionDto.type === ReactionType.DISLIKE) {
          const deleteReaction = await this.reactionRepository
            .createQueryBuilder()
            .delete()
            .from(Reaction)
            .where('id = :id', { id: reaction.id })
            .returning('*')
            .execute();
          lastValueFrom(this.decrementPostLikes(createReactionDto.postId));
          return deleteReaction.raw[0];
        }

        const updatedReaction = await this.reactionRepository
          .createQueryBuilder()
          .update(Reaction, { type: createReactionDto.type })
          .where('id = :id', { id: reaction.id })
          .returning('*')
          .execute();

        return updatedReaction.raw[0];
      }

      // if user has not reacted to the post before, don't permit dislike
      if (createReactionDto.type === ReactionType.DISLIKE) {
        throw new RpcException('You can only dislike a post you have liked');
      }

      // if user has not reacted to the post before, add reaction
      const newReactionObj = this.reactionRepository.create(createReactionDto);
      const newReaction = await this.reactionRepository.save(newReactionObj);
      lastValueFrom(this.incrementPostLikes(createReactionDto.postId));
      return newReaction;
    } catch (error) {
      logger.log(error);
      throw new RpcException(error);
    }
  }

  async findPostReactions({
    page = 1,
    limit = 20,
    postId,
  }: ReactionsPagination): Promise<Reactions> {
    try {
      const offset = (page - 1) * limit;
      const queryBuilder =
        this.reactionRepository.createQueryBuilder('reactions');

      const reactions = await queryBuilder
        .where('reactions.postId = :postId', { postId })
        .take(limit)
        .skip(offset)
        .cache(true)
        .getMany();

      const totalReactions = await queryBuilder
        .where('reactions.postId = :postId', { postId })
        .getCount();
      const totalPages = Math.ceil(totalReactions / limit);
      const hasPrevious = page > 1;
      const hasNext = page < totalPages;

      const resData: Reactions = {
        data: reactions,
        currentPage: page,
        hasNext,
        hasPrevious,
        size: reactions.length,
        totalPages,
      };

      return resData;
    } catch (error) {
      logger.log(error);
      throw new RpcException(error);
    }
  }

  private incrementPostLikes(postId: string): Observable<AxiosResponse<void>> {
    const res$ = this.httpService.patch(
      `${process.env.POSTS_URL}/posts/likes/${postId}`,
    );
    return res$;
  }

  private decrementPostLikes(postId: string): Observable<AxiosResponse<void>> {
    const res$ = this.httpService.delete(
      `${process.env.POSTS_URL}/posts/likes/${postId}`,
    );
    return res$;
  }
}
