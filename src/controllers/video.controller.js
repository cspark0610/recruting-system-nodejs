import { createWriteStream, unlink } from 'fs';
import { promisify } from 'util';
import { UploadVideoToS3, GetVideoFromS3 } from '../services/Video.service';

const unlinkFile = promisify(unlink);

export const getVideoFromS3 = (req, res) => {
  try {
    const { key } = req.params;

    const candidateVideo = GetVideoFromS3(key);

    if (!candidateVideo) {
      return res.status(404).send({
        status: 'failure',
        code: 404,
        message: 'Video not found',
      });
    }

    const stream = createWriteStream(`./downloads/${key}`);

    candidateVideo.pipe(stream);

    res.send('success');
  } catch (e) {
    return new Error(e);
  }
};

export const uploadVideoToS3 = async (req, res) => {
  try {
    const newCandidateVideo = req.file;

    if (!newCandidateVideo) {
      return res.status(400).send({
        status: 'failure',
        code: 400,
        message: 'No file was received',
      });
    }

    const result = await UploadVideoToS3(newCandidateVideo);

    console.log(newCandidateVideo);
    await unlinkFile(newCandidateVideo.path);

    console.log(result);

    res.send({
      status: 'uploaded successfully',
      videoKey: result?.Key,
    });
  } catch (e) {
    return new Error(e);
  }
};
