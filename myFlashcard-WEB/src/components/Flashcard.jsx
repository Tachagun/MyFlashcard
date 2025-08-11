import React, { useState } from 'react';

const Flashcard = ({ question, questionPic, answer, answerPic, detail, tags }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative w-80 h-56 perspective cursor-pointer select-none mx-auto`}
        onClick={() => setFlipped(f => !f)}
        tabIndex={0}
        aria-label="Flip flashcard"
      >
        <div
          className={`absolute w-full h-full transition-transform duration-500 ease-in-out transform ${flipped ? 'rotate-y-180' : ''}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div className="absolute w-full h-full bg-white dark:bg-base-200 rounded-2xl shadow-lg border border-gray-200 dark:border-base-300 flex flex-col items-center justify-center p-4 backface-hidden">
            <div className="font-semibold text-primary mb-1 text-center">Question</div>
          <div className="w-36 h-28 flex items-center justify-center mb-2 bg-base-200 rounded overflow-hidden">
            {questionPic ? (
              <img src={questionPic} alt="Question" className="w-full h-full object-contain rounded" />
            ) : null}
          </div>
            <div className="font-bold text-lg text-primary-content text-center mb-2">{question}</div>
            <div className="mt-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-500 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M5.582 9A7.974 7.974 0 0112 4c2.042 0 3.899.767 5.318 2.029M18.418 15A7.974 7.974 0 0112 20a7.978 7.978 0 01-5.318-2.029" />
              </svg>
            </div>
          </div>
          {/* Back */}
          <div className="absolute w-full h-full bg-primary text-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 rotate-y-180 backface-hidden">
            <div className="font-semibold text-white mb-1 text-center">Answer</div>
          <div className="w-36 h-28 flex items-center justify-center mb-2 bg-primary/30 rounded overflow-hidden">
            {answerPic ? (
              <img src={answerPic} alt="Answer" className="w-full h-full object-contain rounded" />
            ) : null}
          </div>
            <div className="font-bold text-lg text-center mb-2">{answer}</div>
            <div className="mt-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M5.582 9A7.974 7.974 0 0112 4c2.042 0 3.899.767 5.318 2.029M18.418 15A7.974 7.974 0 0112 20a7.978 7.978 0 01-5.318-2.029" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {detail && (
        <div className="mt-2 text-xs text-gray-500 italic text-center max-w-xs">{detail}</div>
      )}
      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 justify-center">
          {[...tags]
            .map(tagObj => tagObj.tag || tagObj)
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, 5)
            .map(tag => (
              <span
                key={tag.id}
                className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20"
              >
                {tag.name}
              </span>
            ))}
        </div>
      )}
    </div>
  );
};

export default Flashcard;

/*
CSS (add to your global styles or Tailwind config):
.perspective { perspective: 1000px; }
.backface-hidden { backface-visibility: hidden; }
.rotate-y-180 { transform: rotateY(180deg); }
*/
