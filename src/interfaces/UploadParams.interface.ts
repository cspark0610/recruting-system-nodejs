import { Readable } from 'stream';

export default interface UploadParams {
  Bucket: string;
  Body: Readable;
  Key: string;
}
