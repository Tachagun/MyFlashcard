import React from 'react';
import useDocumentTitle from '../utils/useDocumentTitle';

function Home() {
  useDocumentTitle('Home');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="card w-full max-w-lg bg-secondary shadow-xl p-8 space-y-4 text-primary-content">
        <h1 className="text-3xl font-bold text-center">Welcome to myFlashcard!</h1>
        <p className="text-center text-lg">Create, study, and manage your flashcards with ease.<br/>Sign up to get started or log in to access your decks.</p>
      </div>
    </div>
  );
}

export default Home;