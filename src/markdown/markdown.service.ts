import { Injectable } from '@nestjs/common';
import { marked } from 'marked';

@Injectable()
export class MarkdownService {
  convertMarkdownToHtml(file: Express.Multer.File) {
    return marked(file.buffer.toString());
  }


}
