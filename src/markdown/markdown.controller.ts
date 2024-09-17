import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MarkdownService } from './markdown.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../file-storage/multer.config';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('markdown')
@Controller('markdown')
export class MarkdownController {
  constructor(private markdownService: MarkdownService) {}

  @Post('convert')
  @ApiOperation({ summary: 'Convert uploaded Markdown file to HTML' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Markdown file converted to HTML successfully.' })
  @ApiResponse({ status: 400, description: 'No file uploaded or invalid file.' })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiBody({
    description: 'Markdown file to be uploaded',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  convertMarkdownToHtml(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.markdownService.convertMarkdownToHtml(file);
  }
}
