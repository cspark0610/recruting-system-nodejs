/* eslint-disable prefer-arrow-callback */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from './interfaces/User';

/**
 * @openapi
 * "components": {
 *  "schemas": {
 *   "User signup schema": {
 *    "type": "object",
 *    "required": [
 *     "name",
 *     "email",
 *     "password"
 *    ],
 *    "properties": {
 *     "name": {
 *      "type": "string",
 *      "example": "John Doe",
 *      "description": "User name"
 *      },
 *      "email": {
 *       "type": "string",
 *       "example":"john.doe@fulltimeforce.com",
 *       "description": "User email",
 *      },
 *      "password": {
 *       "type": "string",
 *       "example": "mystrongpassword",
 *       "description": "User password",
 *       "minLength": 8
 *      },
 *      "role": {
 *       "type": "string",
 *       "example": "CEO",
 *       "description": "User role",
 *       "upperCase": true
 *      },
 *      "position_name": {
 *       "type": "string",
 *       "example": "CEO",
 *       "description": "User position name in company"
 *      },
 *      "phone": {
 *       "type": "string",
 *       "example": "51958164687",
 *       "description": "User phone number",
 *      },
 *     },
 *    },
 *   },
 *  }
 * */

/**
 * @openapi
 * "components": {
 *  "schemas": {
 *   "User sign up response schema": {
 *    "type": "object",
 *    "properties": {
 *     "status": {
 *      "type": "number",
 *      "default": 201
 *     },
 *     "access_token": {
 *      "type": "string",
 *      "description": "access token",
 *      "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjRiNWEyZGFiZWNiNGQ2MGQxOTQ0NzIiLCJpYXQiOjE2NDkzNDU0OTAsImV4cCI6MTY0OTQzMTg5MH0.60D48Nq37cXSdBK97dq6LOzrSk8D-BYOySC_fPq98AM"
 *     },
 *     "refresh_token": {
 *      "type": "string",
 *      "description": "refresh token",
 *      "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjRiNWEyZGFiZWNiNGQ2MGQxOTQ0NzIiLCJpYXQiOjE2NDkzNDU0OTAsImV4cCI6MTY0OTk1MDI5MH0.Ls6EOXcQf8VaRxHZEE5armTMsJU2-hQePsATT2NVrvk"
 *     },
 *     "user": {
 *      "type": "object",
 *      "properties": {
 *       "name": {
 *        "type": "string",
 *        "example": "John Doe",
 *       },
 *       "email": {
 *        "type": "string",
 *        "example": "john.doe@fulltimeforce.com"
 *       },
 *       "position_name": {
 *        "type": "string",
 *        "example": "CEO"
 *        },
 *        "phone": {
 *         "type": "string",
 *         "example": "51958164687"
 *        },
 *        "role": {
 *         "type": "object",
 *         "properties": {
 *          "_id": {
 *           "type": "mongodb ObjectId",
 *           "example": "5e8f8f8f8f8f8f8f8f8f8f8f"
 *          },
 *          "name": {
 *           "type": "string",
 *           "example": "CEO"
 *          },
 *         },
 *        },
 *       },
 *      },
 *     },
 *    },
 *   },
 *  }
 * */

/**
 * @openapi
 * "components": {
 *  "schemas": {
 *   "User signin schema": {
 *    "type": "object",
 *    "required": [
 *     "email",
 *     "password"
 *    ],
 *    "properties": {
 *     "email": {
 *      "type": "string",
 *      "example": "john.doe@fulltimeforce.com",
 *      "description": "User email",
 *     },
 *     "password": {
 *      "type": "string",
 *      "example": "mystrongpassword",
 *      "description": "User password",
 *     },
 *    },
 *   },
 *  },
 * }
 * */

const UserSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    picture: { type: String, required: false },

    refresh_token: { type: String, required: false },

    position_name: {
      type: String,
      required: false,
    },

    phone: {
      type: String,
      required: false,
    },

    role: { type: Schema.Types.ObjectId, ref: 'role', autopopulate: true },

    working_since: { type: String, required: false },

    google_sign_in: { type: Boolean, required: false },
  },
  { versionKey: false },
);

UserSchema.plugin(require('mongoose-autopopulate'));

UserSchema.static(
  'hashPassword',
  function hashPassword(password: string, salt: number) {
    return bcrypt.hash(password, salt);
  },
);

UserSchema.static(
  'comparePassword',
  function comparePassword(originalPassword, hashedPassword) {
    return bcrypt.compare(originalPassword, hashedPassword);
  },
);

export default model<IUser, UserModel>('user', UserSchema);
