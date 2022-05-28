/* eslint-disable prettier/prettier */
import { Reaction } from '../entities/reaction.entity';

export interface Reactions {
  data: Reaction[];
  currentPage: number;
  size: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ReactionsPagination {
  postId: string;
  page?: number;
  limit?: number;
}
