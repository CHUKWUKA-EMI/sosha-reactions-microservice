import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ReactionType } from '../enums/reactions.enums';

export class CreateReactionDto {
  @IsNotEmpty()
  @IsUUID(4)
  postId: string;

  @IsNotEmpty()
  @IsUUID(4)
  userId: string;

  @IsNotEmpty()
  @IsString()
  userFirstName: string;

  @IsNotEmpty()
  @IsString()
  userLastName: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsOptional()
  @IsString()
  userImageUrl: string;

  @IsEnum(ReactionType)
  type: ReactionType;
}
