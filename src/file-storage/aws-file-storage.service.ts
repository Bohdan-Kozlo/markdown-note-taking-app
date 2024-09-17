import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class AwsFileStorageService {
  private s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(private configService: ConfigService) {}

  async uploadFile(fileName: string, file: Buffer) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: fileName,
        Body: file,
      }),
    );
  }

  async deleteFile(fileName: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: fileName,
      }),
    );
  }

  async downloadFile(fileName: string, userId: number) {
    const bucketName = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
    const fileKey = `${userId}/${fileName}`;
    try {
      const data = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
        }),
      );

      return data.Body as Readable;
    } catch {
      throw new NotFoundException(`File ${fileName} not found.`);
    }
  }

  async listUserFiles(userId: number) {
    const backetName = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');

    const params = {
      Bucket: backetName,
      Prefix: `${userId}/`,
    };

    return await this.s3Client.send(new ListObjectsCommand(params));
  }
}
