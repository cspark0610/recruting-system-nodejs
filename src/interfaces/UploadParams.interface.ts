import { ReadStream } from 'fs';

export default interface UploadParams {
  Bucket: string;
  Body: ReadStream;
  Key: string;
}
