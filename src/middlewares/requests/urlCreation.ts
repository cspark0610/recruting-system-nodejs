import { body, query } from 'express-validator';

const urlCreation = [
  query('candidate_id')
    .exists()
    .withMessage('Candidate ID does not exists')
    .isString()
    .withMessage('Candidate ID must be a string')
    .notEmpty()
    .withMessage('Candidate Id must not be empty')
    .isLength({ min: 5 })
    .withMessage('Candidate ID must have at least 5 characters'),

  body('questions')
    .isArray({ min: 2 })
    .withMessage('questions should be an array and have at least 2 elements')
    .notEmpty()
    .withMessage('questions should not be empty'),
];

export default urlCreation;
