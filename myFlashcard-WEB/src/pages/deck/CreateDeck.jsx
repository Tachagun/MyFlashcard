import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useAuthStore from '../../store/auth-store';
import { createDeck } from '../../api/deck';
import { toast } from 'react-toastify';
import useDocumentTitle from '../../utils/useDocumentTitle';

// Validation schema
const schema = yup.object({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  isPublic: yup.boolean(),
});

const CreateDeck = () => {
  useDocumentTitle('Create New Deck');

  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      isPublic: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const newDeck = await createDeck(data, token);
      toast.success('Deck created successfully!');
      reset();
      navigate(`/profile/decks`);
    } catch (error) {
      console.error('Error creating deck:', error);
      toast.error(error.response?.data?.message || 'Failed to create deck');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Create New Deck</h1>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-base-content mb-2">
                Deck Title *
              </label>
              <input
                {...register('title')}
                type="text"
                id="title"
                className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                placeholder="Enter deck title..."
              />
              {errors.title && (
                <p className="text-error text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-base-content mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={4}
                className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
                placeholder="Describe what this deck is about..."
              />
              {errors.description && (
                <p className="text-error text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Public/Private Toggle */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  {...register('isPublic')}
                  type="checkbox"
                  className="checkbox"
                />
                <span className="label-text">
                  Make this deck public (others can view and copy it)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex-1"
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  'Create Deck'
                )}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('/profile/decks')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDeck;
