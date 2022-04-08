import { Schema, model } from 'mongoose';
import {
  valid_main_status,
  valid_secondary_status,
} from '../../config/constants';
import ICandidate from './interfaces/ICandidate.interface';

/**
 * @openapi
 * "components": {
 *  "schemas": {
 *   "Create candidate URL response": {
 *    "type": "object",
 *    "properties": {
 *     "status": {
 *      "type": "number",
 *      "default": 201
 *     },
 *     "client_url": {
 *      "type": "string",
 *      "example": "http://localhost:3001/info/upload?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjRiNDRjNGQyZTI4ZWRlZGY2OWRlZDIiLCJ1cmxfaWQiOiJpZ2ZYd2VoQVIiLCJpYXQiOjE2NDkxMDAwNTksImV4cCI6MTY0OTE4NjQ1OX0.lnaPUoakOfEfxqkl9zdzmqZN_DY1_cOY9GYyEpruAU4"
 *     },
 *    },
 *   },
 *  },
 * }
 * */

/**
 * @openapi
 * "components": {
 *  "schemas": {
 *   "Candidate get info by id": {
 *    "type": "object",
 *    "properties": {
 *     "status": {
 *      "type": "number",
 *      "default": 200,
 *     },
 *     "candidate": {
 *      "type": "object",
 *      "example": {
 *       "name": "John Doe",
	 "email": "John.Doe@fulltimeforce.com",
	 "phone": +514567890,
	 "country": "USA",
	 "english_level": "Advanced",
         "skills": [
          "ReactJS Advance",
          "CSS intermediate"
         ],
	 "conclusions": {
	    "good": ["Good", "Very good"],
	    "bad": ["Bad because of..."]
	  },
	 "main_status": "interested",
	 "secondary_status": "new entry",
         "job": {
	    "_id": "624b5a38abecb4d60d19447c",
	    "title": "FullStack",
	    "client_name": "fcds",
	    "rie_link": "https://www.example.com",
	    "recruiter_filter": "https://www.example.com",
	    "designated": [
	      {
		"_id": "624b5a2dabecb4d60d194472",
		"name": "Juan Hotz",
		"email": "juan@fulltimeforce.com",
		"password": "$2b$12$Sd75df2wXe6x6KYMql1vrehZejj/n56wVHjidHSYoRXbYak2SUxsO",
		"position_name": "CEO",
		"phone": "5158421618",
		"role": {
		  "_id": "622fe86732bd45e3226324ad",
		  "name": "CEO"
		}
	      }
	    ],
	    "skills_required": [
	      "NodeJS",
	      "MongoDB"
	    ],
	    "video_questions_list": [
	      {
		"question_id": 1,
		"question_title": "Tell us about yourself briefly",
		"_id": "624b5a38abecb4d60d19447d"
	      },
	      {
		"question_id": 2,
		"question_title": "Tell us about your experience with react",
		"_id": "624b5a38abecb4d60d19447e"
	      }
	    ],
	   "isActive": true,
	   "url": "http://localhost:3001/info-upload?job_id=624b5a38abecb4d60d19447c"
         },
	 "designated_users": [
	    "Juan Hotz"
	  ],
	  "videos_question_list": [
	    {
	      "question_id": 1,
	      "question_title": "Tell us about yourself briefly",
	      "_id": "624d9f4dfa2ef058e5d84724"
	    },
	    {
	      "question_id": 2,
	      "question_title": "Tell us about your experience with react",
	      "_id": "624d9f4dfa2ef058e5d84725"
	    }
	  ],
	  "cv": "CV Juan Hotz-1649273738125.pdf",
	  "isRejected": false,
	  "_id": "624deb8c25f27662ee49d5cb",
	  "createdAt": "2022-04-06T19:35:40.412Z",
	  "updatedAt": "2022-04-06T19:35:40.412Z",
          "academic_training": "Bachelor",
          "linkedin": "https://www.linkedin.com/in/john-doe/",
          "portfolio": "https://github.com/john-doe",
          "salary_expectations": "$1500",
          "working_reason": "I want to work with FullTimeForce to build a great product"
 *      },
 *     },
 *    },
 *   },
 *  },
 * }
 * */

/**
 * @openapi
 * "components": {
 *  "schemas": {
 *   "Candidate creation model response": {
 *    "type": "object",
 *    "properties": {
 *     "status": {
 *      "type": "number",
 *      "default": 201,
 *     },
 *     "data": {
 *      "type": "object",
 *      "properties": {
 *      "name": {
 *       "type": "string",
 *       "example": "John Doe"
 *      },
 *      "main_status": {
 *       "type": "string",
 *       "example": "interested"
 *      },
 *      "secondary_status": {
 *       "type": "string",
 *       "example": "new entry"
 *      },
 *      "job": {
 *       "type": "string",
 *       "example": "Fullstack"
 *      },
 *      "designated_recruiters": {
 *       "type": "array",
 *       "example": [
 *        "Harumi",
 *        "Gabriela"
 *       ],
 *      },
 *      "_id": {
 *       "type": "mongodb object id",
 *       "example": "624deb8c25f27662ee49d5cb"
 *      },
 *      "createdAt": {
 *       "type": "date",
 *       "example": "2022-04-06T19:35:40.412Z"
 *      },
 *      "updatedAt": {
 *       "type": "date",
 *       "example": "2022-04-06T19:35:40.412Z"
 *      },
 *      },
 *     },
 *    },
 *   },
 *  },
 * }
 * */

/**
 * @openapi
 * "components": {
 *  "schemas": {
 *   "Candidate update model": {
 *    "type": "object",
 *    "required": [
 *     "academic_training",
 *     "salary_expectations",
 *     "linkedin",
 *     "skills",
 *    ],
 *    "properties": {
 *     "academic_training": {
 *      "type": "string",
 *      "description": "Candidate academic training",
 *      "example": "Bachelor",
 *     },
 *     "salary_expectations": {
 *      "type": "string",
 *      "description": "Candidate salary expectations",
 *      "example": "$1500",
 *     },
 *     "linkedin": {
 *      "type": "string",
 *      "description": "Candidate linkedin",
 *      "example": "https://www.linkedin.com/in/john-doe/",
 *     },
 *     "skills": {
 *      "type": "array",
 *      "description": "Candidate skills",
 *      "example": [
 *       "React",
 *       "Angular",
 *       "NodeJS",
 *      ],
 *     },
 *     "portfolio": {
 *      "type": "string",
 *      "description": "Candidate portfolio",
 *      "example": https://github.com/john-doe"
 *     },
 *     "working_reason": {
 *      "type": "string",
 *      "description": "Candidate working reason",
 *      "example": "I want to work with FullTimeForce to build a great product"
 *     },
 *     "available_from": {
 *      "type": "Date string",
 *      "description": "Date when candidate is available to meet",
 *      "example": "2020-04-06T19:35:40.412Z"
 *      },
 *     },
 *    },
 *   },
 * }
 * */

/**
 * @openapi
 * "components": {
 *  "schemas": {
 *   "Candidate creation model": {
 *    "type": "object",
 *    "required": [
 *     "name",
 *     "email",
 *     "phone",
 *     "cv",
 *     "country",
 *     "job",
 *     "english_level",
 *    ],
 *    "properties": {
 *      "name": {
 *       "type": "string",
 *       "description": "Candidate name",
 *       "example": "John Doe",
 *      },
 *      "email": {
 *       "type": "string",
 *       "description": "Candidate email",
 *       "example": John.Doe@fulltimeforce.com"
 *      },
 *      "phone": {
 *       "type": "string",
 *       "description": "Candidate phone number",
 *       "example": "+514567890",
 *      },
 *      "cv": {
 *       "type": "file",
 *       "description": "Candidate cv - pdf file",
 *      },
 *      "country": {
 *       "type": "string",
 *       "description": "Candidate country",
 *       "example": "USA",
 *      },
 *      "job": {
 *       "type": "mongodb ObjectId",
 *       "description": "Candidate job",
 *       "example": "615848912358949",
 *      },
 *      "english_level": {
 *       "type": "string",
 *       "description": "Candidate english level",
 *       "example": "Advanced",
 *      },
 *    },
 *   },
 *  },
 * }
 * */
const CandidateSchema = new Schema<ICandidate>(
  {
    name: { type: String, required: true },

    email: { type: String, required: true },

    phone: { type: Number, required: true },

    country: { type: String, required: true },

    academic_training: { type: String, required: false },

    salary_expectations: { type: String, required: false },

    available_from: { type: Date, required: false },

    english_level: { type: String, required: true },

    skills: { type: [String], required: false },

    linkedin: { type: String, required: false },

    portfolio: { type: String, required: false },

    working_reason: { type: String, required: false },

    conclusions: {
      good: { type: [String], required: false },

      bad: { type: [String], required: false },
    },

    main_status: {
      type: String,
      enum: valid_main_status,
      required: true,
    },

    secondary_status: {
      type: String,
      enum: valid_secondary_status,
      required: true,
    },

    job: { type: Schema.Types.ObjectId, ref: 'job', autopopulate: true },

    designated_recruiters: { type: [String], required: false },

    video_recording_url: {
      type: Schema.Types.ObjectId,
      ref: 'video_recording_url',
      autopopulate: true,
    },

    videos_question_list: [
      {
        question_id: Number,
        question_title: String,
        video_key: String,
      },
    ],

    cv: {
      type: String,
      required: true,
    },

    isRejected: { type: Boolean, required: true, default: false },
  },

  { versionKey: false, timestamps: true },
);

CandidateSchema.plugin(require('mongoose-autopopulate'));

export default model<ICandidate>('candidate', CandidateSchema);
