import * as yup from 'yup';

const deckSchema = yup.object().shape({
  title: yup.string().trim().min(3, 'Title must be at least 3 characters').max(64, 'Title must be at most 64 characters').required('Title is required'),
  description: yup.string().max(200, 'Description must be at most 200 characters').nullable(),
  categoryName: yup.string().max(32, 'Category must be at most 32 characters').nullable(),
  isPublic: yup.boolean(),
  coverImage: yup.string().url('Cover image must be a valid URL').nullable(),
});

export default deckSchema;
