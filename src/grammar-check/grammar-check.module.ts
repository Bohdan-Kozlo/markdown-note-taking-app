import { Module } from '@nestjs/common';
import { GrammarCheckController } from './grammar-check.controller';
import { GrammarCheckService } from './grammar-check.service';
import { HttpModule } from '@nestjs/axios';
import { FileStorageService } from '../file-storage/file-storage.service';
import { FileStorageModule } from "../file-storage/file-storage.module";

@Module({
  imports: [HttpModule, FileStorageModule],
  controllers: [GrammarCheckController],
  providers: [GrammarCheckService],
})
export class GrammarCheckModule {}
