const { unlink } = require('fs');
const { promisify } = require('util');
const uploadVideoToS3 = require('../services/Video.service');

const unlinkFile = promisify(unlink);

module.exports = {
  saveVideoToS3: async (req, res) => {
    try {
      const file = req.file;
      const result = await uploadVideoToS3(file);

      console.log(file);
      await unlinkFile(file.path);

      console.log(result);

      res.send('upload successfully');
    } catch (e) {
      console.error(e);
    }
  },
};
