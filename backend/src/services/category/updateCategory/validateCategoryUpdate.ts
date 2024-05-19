import Joi from 'joi';
import { CustomError } from '@src/utils/CustomError';
import { CategoryUpdate } from '.';

const categorySchema = Joi.object({
  title: Joi.string().lowercase().trim().min(3).max(32).required(),
});

const validateCategoryUpdate = (update: CategoryUpdate): CategoryUpdate => {
  const { error, value } = categorySchema.validate(update);

  if (error) {
    const errorStatus = 400;
    const errorMessage = error.details[0].message;
    throw new CustomError(errorStatus, errorMessage);
  }

  return value;
};

export default validateCategoryUpdate;
