import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,JoinColumn ,OneToMany} from 'typeorm';
import {User, Comment} from './index';

@Entity("articles")

export class Article {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title!: string

  @Column()
  content!: string

  @Column()
  views!: number

  @Column()
  create_time!: Date

  @Column()
  update_time!: Date

  @Column()
  is_delete!: Number

  @ManyToOne(() => User,{
    // * 会自动保存user
    cascade: true,
  })
  @JoinColumn({name:'user_id'})
  user!: User

  @OneToMany(() => Comment, (comment: any) => comment.article)
  comments!: Comment[]
}