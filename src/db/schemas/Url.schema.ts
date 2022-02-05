import mongoose from 'mongoose';
import shortId from 'shortid';

const UrlSchema = new mongoose.Schema({
  redirectUrl: {
    type: String,
    required: true,
  },

  shortUrl: {
    type: String,
    required: true,
    default: shortId.generate,
  },

  expiresAt: {
    type: Date,
    default: new Date(),
    index: { expires: '24h' },
  },
});

UrlSchema.index({ expiresAt: 1 }, { expires: '24h' });

export default mongoose.model('Url', UrlSchema);
