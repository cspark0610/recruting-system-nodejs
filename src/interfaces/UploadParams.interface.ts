import { Readable } from 'stream';

export interface UploadParams {
  Bucket: string;
  Body: Readable;
  Key: string;
}
