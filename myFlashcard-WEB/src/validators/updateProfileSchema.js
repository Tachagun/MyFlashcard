import * as yup from 'yup';

export const updateProfileSchema = yup.object().shape({
  username: yup.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .notRequired()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value),
  profilePic: yup.string().url().nullable(),
  aboutMe: yup.string().max(200).nullable(),
});
