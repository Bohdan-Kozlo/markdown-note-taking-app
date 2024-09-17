import { Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { GrammarCheckService } from "./grammar-check.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller('grammar-check')
@ApiTags('grammar-check')
@ApiBearerAuth()
export class GrammarCheckController {
  constructor(private grammarCheckService: GrammarCheckService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check grammar in the markdown file' })
  @ApiParam({ name: 'fileName', description: 'Name of the file to check grammar' })
  @ApiResponse({ status: 200, description: 'Grammar check successful.' })
  @ApiResponse({ status: 404, description: 'File not found.' })
  @Post(':fileName')
  async checkGrammar(@Param('fileName') fileName: string, @Req() req: Request) {
    const userId = +req.user['userId'];
    return await this.grammarCheckService.checkGrammar(fileName, userId);
  }
}

