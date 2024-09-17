import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FileData } from '../file-storage/file-data.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  urlAvatar: string;

  @OneToMany(() => FileData, (file) => file.user)
  files: FileData[];
}
