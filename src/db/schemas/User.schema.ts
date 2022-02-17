import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
  },

  video_key: {
    type: String,
    required: false,
  },
});

export default model('user', UserSchema);
