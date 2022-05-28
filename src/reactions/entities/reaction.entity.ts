import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  // UpdateDateColumn,
} from 'typeorm';
import { ReactionType } from '../enums/reactions.enums';

@Entity({ name: 'Reactions' })
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: ReactionType, type: 'enum', enumName: 'ReactionType' })
  type: ReactionType;

  @Index()
  @Column({ type: 'uuid', nullable: false })
  postId: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ nullable: false })
  userFirstName: string;

  @Column({ nullable: false })
  userLastName: string;

  @Column({ nullable: false })
  userName: string;

  @Column({ nullable: true })
  userImageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;
}
