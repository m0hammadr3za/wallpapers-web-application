import findCategoryById from '@repositories/category/findCategoryById';
import { CustomError } from '@utils/CustomError';

const checkCategoryExists = async (categoryId: string) => {
  const category = await findCategoryById(categoryId);

  if (!category) {
    const errorStatus = 404;
    const errorMessage = "A category with this id doesn't exist!";
    throw new CustomError(errorStatus, errorMessage);
  }

  return category;
};

export default checkCategoryExists;
