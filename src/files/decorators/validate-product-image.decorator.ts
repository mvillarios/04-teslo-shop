import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';

export const ValidateProductImage = () =>
  UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 3 }), // 3MB
        new FileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        }),
      ],
    }),
  );
