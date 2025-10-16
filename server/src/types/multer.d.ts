import { File as MulterFile } from "multer";

// For array uploads (upload.array or upload.fields)
export type UploadedFilesArray = MulterFile[];

// For single file (upload.single)
export type UploadedSingleFile = MulterFile;

// For .fields() with multiple keys
export interface UploadedFilesFields {
  [fieldname: string]: MulterFile[];
}
