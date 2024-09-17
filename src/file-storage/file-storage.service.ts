import { BadRequestException, Injectable } from '@nestjs/common';
import { AwsFileStorageService } from './aws-file-storage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FileData } from './file-data.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class FileStorageService {
  constructor(
    private uploadService: AwsFileStorageService,
    @InjectRepository(FileData)
    private fileDataRepository: Repository<FileData>,
    private usersService: UsersService,
  ) {}

  generateUniqueFileName(userId: number, fileName: string) {
    return `${userId}/${fileName}`;
  }

  async saveFileDataToDB(fileName: string, file: Buffer, userId: number) {
    const isExist = await this.fileDataRepository.findOneBy({ name: fileName });
    if (isExist) {
      return await this.fileDataRepository.update(
        { name: fileName },
        { data: file.toString() },
      );
    }
    const fileData = new FileData();
    fileData.user = await this.usersService.findById(userId);
    fileData.name = fileName;
    fileData.data = file.toString();
    return this.fileDataRepository.save(fileData);
  }

  async uploadFile(fileName: string, file: Buffer, userId: number) {
    if (fileName.length > 30) {
      throw new BadRequestException('File name is too long');
    }
    if (file.length === 0) {
      throw new BadRequestException('File is empty');
    }
    try {
      const newFileName = this.generateUniqueFileName(userId, fileName);
      console.log(newFileName);
      await this.saveFileDataToDB(newFileName, file, userId);
      await this.uploadService.uploadFile(newFileName, file);
    } catch {
      throw new BadRequestException('File upload failed');
    }
  }

  async getFileData(fileName: string) {
    return await this.fileDataRepository.findOneBy({ name: fileName });
  }
}
