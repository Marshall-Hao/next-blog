import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Article, User } from './index';

@Entity('tags')

export class Tag {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title!: string

  @Column()
  icon!: string

  @Column()
  follow_count!: number

  @Column()
  article_count!: number

  @ManyToMany(() => User, {
    cascade: true
  })
  // * 中间的关联表
  @JoinTable({
    name: 'tags_users_rel',
    joinColumn: {
      name: 'tag_id'
    },
    inverseJoinColumn: {
      name: 'user_id'
    }
  })
  users!: User[]

  @ManyToMany(() => Article, (article) => article.tags)
  @JoinTable({
    name: 'articles_tags_rel',
    joinColumn: {
      name: 'tag_id'
    },
    inverseJoinColumn: {
      name: 'article_id'
    }
  })
  articles!: Article[]
}