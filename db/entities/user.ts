import { Entity , Column, PrimaryColumn} from 'typeorm';

@Entity("users")

export class User {
  @PrimaryColumn()
  readonly id!: number

  @Column()
  nickname!: string

  @Column()
  avatar!: string

  @Column()
  job!: string

  @Column()
  introduce!: string


}