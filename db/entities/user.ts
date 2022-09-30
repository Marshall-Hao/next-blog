import { Entity , Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity("users")

export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  nickname!: string

  @Column()
  avatar!: string

  @Column()
  job!: string

  @Column()
  introduce!: string


}