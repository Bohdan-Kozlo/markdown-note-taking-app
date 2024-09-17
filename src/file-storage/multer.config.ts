import { BadRequestException } from '@nestjs/common';

export const multerConfig = {
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== 'text/markdown') {
      return callback(
        new BadRequestException('Only .md files are allowed!'),
        false,
      );
    }
    return callback(null, true);
  },
};
