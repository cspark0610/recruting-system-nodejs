import { Schema, model, Types } from "mongoose";
import {
	valid_academic_trainings,
	valid_english_levels,
	// valid_main_status,
	// valid_secondary_status,
} from "../../config";
import ICandidate from "./interfaces/ICandidate.interface";

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
 *   "Candidate get info by id response": {
 *    "type": "object",
 *    "properties": {
 *     "status": {
 *      "type": "number",
 *      "default": 200,
 *     },
 *     "candidate": {
 *      "type": "object",
 *      "properties": {
 *       "name": {
 *        "type": "string",
 *        "example": "John Doe"
 *       },
 *       "email": {
 *        "type": "string",
 *        "example": "John.Doe@google.com"
 *       },
 *       "phone": {
 *        "type": "string",
 *        "example": "+5158421618"
 *       },
 *       "country": {
 *        "type": "string",
 *        "example": "US"
 *       },
 *       "english_level": {
 *        "type": "string",
 *        "example": "Advanced"
 *       },
 *       "skills": {
 *        "type": "array",
 *        "items": {
 *         "type": "string",
 *         "example": "JavaScript"
 *         },
 *         "example": [
 *          "ReactJS Advanced",
 *          "CSS intermediate"
 *         ]
 *        },
 *        "conclusions": {
 *         "type": "object",
 *         "properties": {
 *          "good": {
 *           "type": "array",
 *           "items": {
 *            "type": "string",
 *           },
 *           "example": [
 *            "Good",
 *            "Very good"
 *           ],
 *          },
 *          "bad": {
 *           "type": "array",
 *           "items": {
 *            "type": "string",
 *           },
 *           "example": [
 *            "Bad because of..."
 *           ],
 *          },
 *         },
 *        },
 *        "main_status": {
 *         "type": "string",
 *         "example": "interested"
 *        },
 *        "secondary_status": {
 *         "type": "string",
 *         "example": "new entry"
 *        },
 *        "job": {
 *         "type": "object",
 *         "properties": {
 *          "_id": {
 *           "type": "mongodb ObjectId",
 *           "example": "624b5a38abecb4d60d19447c"
 *          },
 *          "title": {
 *           "type": "string",
 *           "example": "Frontend developer"
 *          },
 *          "client_name": {
 *           "type": "string",
 *           "example": "Fulltime"
 *          },
 *          "rie_link": {
 *           "type": "string",
 *           "example": "https://www.rie.com/job/frontend-developer"
 *          },
 *          "recruiter_filter": {
 *           "type": "string",
 *           "example": "https://www.filter.com/job/frontend-developer"
 *          },
 *          "designated_recruiters": {
 *            "type": "array",
 *            "items": {
 *             "type": "object",
 *             "properties": {
 *              "_id": {
 *               "type": "mongodb ObjectId",
 *               "example": "624b5a38abecb4d60d19447c"
 *              },
 *              "name": {
 *               "type": "string",
 *               "example": "Harumi"
 *              },
 *              "email": {
 *               "type": "string",
 *               "example": "harumi@fulltimeforce.com"
 *              },
 *              "phone": {
 *               "type": "string",
 *               "example": "+5158421618"
 *              },
 *              "position_name": {
 *               "type": "string",
 *               "example": "RRHH"
 *              },
 *              "password": {
 *               "type": "string",
 *               "example": "$2b$12$Sd75df2wXe6x6KYMql1vrehZejj/n56wVHjidHSYoRXbYak2SUxsO"
 *              },
 *              "role": {
 *               "type": "object",
 *               "properties": {
 *                "_id": {
 *                 "type": "mongodb ObjectId",
 *                 "example": "622fe86732bd45e3226324ad"
 *                },
 *                "name": {
 *                 "type": "string",
 *                 "example": "RRHH"
 *                },
 *               },
 *              },
 *             },
 *             "skills_required": {
 *              "type": "array",
 *              "items": {
 *               "type": "string",
 *               "example": "JavaScript"
 *              },
 *              "example": [
 *               "ReactJS Advanced",
 *               "CSS intermediate"
 *              ]
 *             },
 *           },
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
 *   "Candidate creation response": {
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
 *       "items": {
 *        "type": "string",
 *       },
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
 *   "Candidate update": {
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
 *      "items": {
 *       "type": "string",
 *      },
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
 *   "Candidate creation": {
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
 *       "example": "John.Doe@fulltimeforce.com"
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
 *       "description": "Candidate job id to which they are applying for",
 *       "example": "624d9f4dfa2ef058e5d84723",
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

		academic_training: {
			type: String,
			enum: valid_academic_trainings,
			required: false,
		},

		available_from: { type: String, required: false },

		english_level: { type: String, enum: valid_english_levels, required: true },

		birth_date: { type: String, required: true },

		conclusions: {
			good: {
				type: [
					{
						comment: String,
						context: String,
						user: {
							_id: Types.ObjectId,
							name: String,
							email: String,
							picture: String,
						},
					},
				],
				required: false,
			},

			bad: {
				type: [
					{
						comment: String,
						context: String,
						user: {
							_id: Types.ObjectId,
							name: String,
							email: String,
							picture: String,
						},
					},
				],
				required: false,
			},
		},

		position: {
			type: Schema.Types.ObjectId,
			ref: "position",
			autopopulate: true,
		},

		postulations: {
			type: [Schema.Types.ObjectId],
			ref: "postulation",
			default: [],
			autopopulate: true,
		},

		designated_recruiters: { type: [String], required: false, default: [] },

		cv: {
			type: String,
			required: true,
		},

		isRejected: { type: Boolean, required: true, default: false },
	},

	{ versionKey: false, timestamps: true }
);

CandidateSchema.plugin(require("mongoose-autopopulate"));

export default model<ICandidate>("candidate", CandidateSchema);
