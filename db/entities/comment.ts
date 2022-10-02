import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Article, User } from './index';

@Entity('comments')

export class Comment {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  content!: string

  @Column()
  create_time!: Date

  @Column()
  update_time!: Date

  @ManyToOne(() => User)
  @JoinColumn({name:'user_id'})
  user!: User

  @ManyToOne(() => Article,(article) => article.comments)
  @JoinColumn({name:'article_id'})
  article!: Article
}

