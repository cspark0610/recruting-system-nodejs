# videointerview

## How to use

First, make sure you have MongoDB installed on your system. If you do not have it, [click here](https://www.mongodb.com/try/download/community) to download it.

Then, follow the below steps:

- Download the repo and run the command `npm install` to install all the dependencies needed.
- Create a `.env` file with the following variables:

```bash
AWS_BUCKET_ACCESS_KEY=AKIAZ7XGGMFX7JWBAFH4
AWS_BUCKET_SECRET_ACCESS_KEY=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
AWS_VIDEO_BUCKET_NAME=videorecorderbucket
AWS_CV_BUCKET_NAME=candidatescvbucket
AWS_BUCKET_REGION=us-east-2
MONGODB_PRODUCTION_URI=mongodb+srv://nachohotz2:sempron3amd18@cluster0.ywin2.mongodb.net/urls
MONGODB_DEVELOPMENT_URI=mongodb://localhost:27017/urls
REDIRECT_URL_DEVELOPMENT=http://localhost:3001
REDIRECT_URL_PRODUCTION=https://fulltimeforce-video-interview.herokuapp.com
JWT_ACCESS_TOKEN_SECRET=fYX33&BDsTxRKG&TAT8LRjc7nfjFk8JTdLoNEnA5
JWT_ACCESS_TOKEN_EXP=1d
JWT_REFRESH_TOKEN_SECRET=cafyHz!s#QDkPPrfkg?@Ce9nzKt3YyNSt@am!bY$
JWT_REFRESH_TOKEN_EXP=7d
NODE_ENV=production
```

- Once that is done, execute the following command: `npm run dev` to run the app in development mode. **DO NOT** use `npm start` because that command is for **production** use **only**.
