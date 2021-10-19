import { Controller, Post, UploadedFile, UseInterceptors, UseGuards, Param, Res, Get, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { editFileName, imageFileFilter } from 'src/utils/file-uploading.utils';
import { responseObj } from 'src/utils/ReponseObj';

@Controller('file')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth()
export class FileController {

    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
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
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './files',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadedFile(@UploadedFile() file) {
        const obj = {
            filename: file.filename,
        };
        return responseObj(obj);
    }

    @Get('/:filename')
    @ApiParam({ type: 'string', name: 'filename', required: true })
    async serveAvatar(@Param('filename') filename, @Res() res): Promise<any> {
        res.sendFile(filename, { root: 'files' });
    }
}
