import { Module } from '@nestjs/common';
import { FileStorageController } from './file-storage.controller';
import { FileStorageService } from './file-storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileData } from './file-data.entity';
import { AwsFileStorageService } from './aws-file-storage.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([FileData]), UsersModule],
  controllers: [FileStorageController],
  providers: [FileStorageService, AwsFileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
