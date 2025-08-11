import { useEffect } from 'react';

/**
 * Custom hook to dynamically set the document title
 * @param {string} title - The title to set for the page
 * @param {boolean} keepOnUnmount - Whether to keep the title when component unmounts
 */
export const useDocumentTitle = (title, keepOnUnmount = true) => {
  useEffect(() => {
    const originalTitle = document.title;
    
    if (title) {
      document.title = `${title} | myFlashcard`;
    }

    return () => {
      if (!keepOnUnmount) {
        document.title = originalTitle;
      }
    };
  }, [title, keepOnUnmount]);
};

export default useDocumentTitle;
