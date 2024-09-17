import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'file_data' })
export class FileData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'longtext' })
  data: string;

  @ManyToOne(() => User, (user) => user.files)
  user: User;
}
