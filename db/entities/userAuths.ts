import { Entity , Column, PrimaryColumn, ManyToOne, JoinColumn} from 'typeorm';
import {User} from './user';

@Entity("user_auths")

export class UserAuth {
  @PrimaryColumn()
  readonly id!: number

  @Column()
  identity_type!: string

  @Column()
  identifier!: string

  @Column()
  credential!: string

  @ManyToOne(() => User,{
    cascade: true,
  })
  @JoinColumn({name:'uder_id'})
  user!: User
}