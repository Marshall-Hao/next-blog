import { Entity , Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import {User} from './user';

@Entity("user_auths")

export class UserAuth {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  identity_type!: string

  @Column()
  identifier!: string

  @Column()
  credential!: string

  @ManyToOne(() => User,{
    // * 会自动保存user
    cascade: true,
  })
  @JoinColumn({name:'user_id'})
  user!: User
}