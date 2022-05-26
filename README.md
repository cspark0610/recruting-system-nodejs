# videointerview

WorkAt backend project migration - Fulltimeforce

## How to use

First, make sure you have MongoDB installed on your system. If you do not have it, [click here](https://www.mongodb.com/try/download/community) to download it.

**Also, make sure you are using Node `16.14.0` and NPM `8.3.1`, since these are the versions the project runs on.**

Then, follow the below steps:

- Download the repo and run the command `npm install` to install all the dependencies needed.
- Create a `.env` file with the following variables:

```bash
AWS_BUCKET_ACCESS_KEY=AKIAZ7XGGMFX7JWBAFH4
AWS_BUCKET_SECRET_ACCESS_KEY=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
AWS_BUCKET_REGION=us-east-2

AWS_VIDEO_BUCKET_NAME=videorecorderbucket
AWS_CV_BUCKET_NAME=candidatescvbucket

MONGODB_PRODUCTION_URI=mongodb+srv://nachohotz2:sempron3amd18@cluster0.ywin2.mongodb.net/videoInterview
MONGODB_STAGING_URI=mongodb+srv://nachohotz2:sempron3amd18@cluster0.ywin2.mongodb.net/videoInterview-staging
MONGODB_DEVELOPMENT_URI=mongodb://localhost:27017/videoInterview

REDIRECT_URL_DEVELOPMENT=http://localhost:3000
REDIRECT_URL_PRODUCTION=https://workat-five.vercel.app/

GOOGLE_CLIENT_ID=564534888385-36u4qfv42jb0s38h026i2t608dukd2hh.apps.googleusercontent.com

JWT_ACCESS_TOKEN_SECRET=fYX33&BDsTxRKG&TAT8LRjc7nfjFk8JTdLoNEnA5
JWT_ACCESS_TOKEN_EXP=15min

JWT_REFRESH_TOKEN_SECRET=cafyHz!s#QDkPPrfkg?@Ce9nzKt3YyNSt@am!bY$
JWT_REFRESH_TOKEN_EXP=2d

JWT_VIDEO_TOKEN_SECRET=haq3XDaY4oT7Roai#7tNcn$LMr3C5hDo&T9!#a!c
JWT_VIDEO_TOKEN_EXP=30d

RESET_PASSWORD_KEY=FXktiCt!Tjg8r@HnG3!S??a!8cCgtqekqJLt@oPG

NODE_ENV=production

```

- Once that is done, execute the following command: `npm run dev` to run the app in development mode. **DO NOT** use `npm start` because that command is for **production** use **only**.
