import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FileStorageService } from '../file-storage/file-storage.service';
import { AxiosResponse } from "axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class GrammarCheckService {
  private readonly languageToolUrl = 'https://api.languagetool.org/v2/check';

  constructor(
    private httpService: HttpService,
    private fileStorageService: FileStorageService,
  ) {}

  async checkGrammar(fileName: string, userId) {

      const newFileName = `${userId}/${fileName}`;
      const fileData = await this.fileStorageService.getFileData(newFileName);

      if (!fileData) {
        throw new BadRequestException('File not found in the database');
      }

    const response: AxiosResponse = await firstValueFrom(
      this.httpService.post(
        this.languageToolUrl,
        new URLSearchParams({
          text: fileData.data,
          language: 'en-US',
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

      return response.data;
  }
}
