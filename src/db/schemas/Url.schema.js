const mongoose = require('mongoose');
const shortId = require('shortid');

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

module.exports = mongoose.model('Url', UrlSchema);
