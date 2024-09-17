import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { FileStorageService } from './file-storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { AwsFileStorageService } from './aws-file-storage.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('markdown-file-storage')
@ApiBearerAuth()
@Controller('markdown-file-storage')
export class FileStorageController {
  constructor(
    private fileStorageService: FileStorageService,
    private awsS3Service: AwsFileStorageService,
  ) {}

  @Get('/download/:fileName')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Download a file' })
  @ApiParam({ name: 'fileName', description: 'Name of the file to download' })
  @ApiResponse({ status: 200, description: 'File downloaded successfully.' })
  @ApiResponse({ status: 404, description: 'File not found.' })
  async downloadFile(
    @Param('fileName') fileName: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const userId = +req.user['userId'];
    const fileStream = await this.awsS3Service.downloadFile(fileName, userId);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${fileName}`,
    });
    fileStream.pipe(res);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload a file' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid file.' })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = +req.user['userId'];
    await this.fileStorageService.uploadFile(
      file.originalname,
      file.buffer,
      userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List user files' })
  @ApiResponse({ status: 200, description: 'Files retrieved successfully.' })
  @Get('')
  async listUserFiles(@Req() req: Request) {
    const userId = +req.user['userId'];
    const files = await this.awsS3Service.listUserFiles(userId);
    return files.Contents;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({ name: 'fileName', description: 'Name of the file to delete' })
  @ApiResponse({ status: 200, description: 'File deleted successfully.' })
  @ApiResponse({ status: 404, description: 'File not found.' })
  @Delete(':fileName')
  async deleteFile(@Param('fileName') fileName: string, @Req() req: Request) {
    const userId = req.user['userId'];
    const fullFileName = `${userId}/${fileName}`;
    await this.awsS3Service.deleteFile(fullFileName);
  }
}
