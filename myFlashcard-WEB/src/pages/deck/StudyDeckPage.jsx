import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDeckDetail } from "../../api/deck";
import useAuthStore from "../../store/auth-store";
import { getContainerClass, layoutReminder } from "../../utils/layoutConstants";
import useDocumentTitle from "../../utils/useDocumentTitle";

function StudyDeckPage() {
  // Layout reminder - so I never forget about header/sidebar again!
  if (process.env.NODE_ENV === 'development') {
    layoutReminder();
  }

  const navigate = useNavigate();
  const { deckId } = useParams();
  const { token } = useAuthStore();
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [studyStats, setStudyStats] = useState({
    startTime: Date.now(),
    cardsReviewed: 0,
    correctAnswers: 0
  });
  const cardRef = useRef(null);
  
  // Dynamic title based on deck name
  useDocumentTitle(deck ? `Study: ${deck.title}` : 'Study Mode');

  // Fetch deck and flashcards
  useEffect(() => {
    const loadDeck = async () => {
      try {
        setLoading(true);
        const data = await fetchDeckDetail(deckId);
        console.log("Deck data:", data); // Debug log
        setDeck(data.deck);
        
        // Extract flashcards from the nested structure
        const extractedFlashcards = data.deck.flashcards?.map(fc => fc.flashcard) || [];
        console.log("Extracted flashcards:", extractedFlashcards); // Debug log
        setFlashcards(extractedFlashcards);
        setLoading(false);
      } catch (error) {
        console.error("Error loading deck:", error);
        setLoading(false);
      }
    };
    
    loadDeck();
  }, [deckId]);
  
  // Handle card rating (correct/incorrect)
  const handleCardRating = (isCorrect) => {
    setStudyStats(prev => ({
      ...prev,
      cardsReviewed: prev.cardsReviewed + 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers
    }));
    
    // Move to next card
    if (idx < flashcards.length - 1) {
      setIdx(idx + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };
  
  // Calculate study duration in minutes
  const getStudyDuration = () => {
    const durationMs = Date.now() - studyStats.startTime;
    return Math.max(1, Math.round(durationMs / 60000));
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4 text-base-content">Loading flashcards...</p>
      </div>
    );
  }
  
  // Handle empty deck or error
  if (!deck || !flashcards || flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-xl font-bold text-error mb-2">No flashcards found in this deck.</div>
        <button className="btn btn-accent" onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }
  
  const card = flashcards[idx];
  const cardFlipClass = showAnswer ? "rotate-y-180" : "";
  
  return (
    <div className={getContainerClass('large')}>
      {/* Header Section */}
      <div className="mb-6 mt-4">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-3">
            {deck.coverImage && (
              <img 
                src={deck.coverImage} 
                alt="Deck Cover" 
                className="w-12 h-12 object-cover rounded-lg shadow border border-base-300" 
              />
            )}
            <h2 className="text-2xl font-bold text-primary">
              {deck.title}
            </h2>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mx-auto mb-4">
          <div className="w-full h-3 bg-gray-200 dark:bg-base-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-300"
              style={{ width: `${((idx + (completed ? 1 : 0)) / flashcards.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-500 mt-2 text-right">
            {Math.min(idx + 1, flashcards.length)} / {flashcards.length}
          </div>
        </div>
      </div>

      {/* Main Study Area */}
      <div className="flex flex-col items-center justify-center">
        {/* Card flip container */}
        <div
          ref={cardRef}
          className="relative w-full max-w-2xl min-h-[400px] perspective mb-8"
          style={{ perspective: 1200 }}
        >
          <div
            className={`transition-transform duration-500 transform-style-preserve-3d ${cardFlipClass}`}
            style={{ minHeight: 400 }}
          >
            {/* Front: Question */}
            <div className="absolute w-full h-full backface-hidden bg-white dark:bg-base-200 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center border border-base-300">
              <div className="font-bold text-xl mb-6 text-primary text-center">Q: {card.question}</div>
              <div style={{ minHeight: 150, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {card.questionPic ? (
                  <img src={card.questionPic} alt="question" className="mb-4 max-h-40 rounded-lg mx-auto shadow" />
                ) : null}
              </div>
              <button className="btn btn-info btn-lg mt-6 px-8" onClick={() => setShowAnswer(true)}>
                Show Answer
              </button>
            </div>
            
            {/* Back: Answer */}
            <div className="absolute w-full h-full backface-hidden bg-white dark:bg-base-200 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center rotate-y-180 border border-base-300">
              <div className="font-bold text-xl mb-6 text-primary text-center">A: {card.answer}</div>
              <div style={{ minHeight: 150, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {card.answerPic ? (
                  <img src={card.answerPic} alt="answer" className="mb-4 max-h-40 rounded-lg mx-auto shadow" />
                ) : null}
              </div>
              {card.detail && <div className="text-sm text-gray-600 dark:text-gray-400 italic mb-6 text-center max-w-lg">{card.detail}</div>}
              
              <div className="flex flex-col gap-4 mt-6 w-full max-w-sm">
                <button className="btn btn-outline" onClick={() => setShowAnswer(false)}>
                  Back to Question
                </button>
                <div className="divider text-xs">Rate this card</div>
                <div className="flex gap-3 w-full">
                  <button 
                    className="btn btn-error flex-1" 
                    onClick={() => handleCardRating(false)}
                  >
                    Incorrect
                  </button>
                  <button 
                    className="btn btn-success flex-1" 
                    onClick={() => handleCardRating(true)}
                  >
                    Correct
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        {!showAnswer && (
          <div className="flex gap-4 justify-center w-full max-w-md">
            <button 
              className="btn btn-outline" 
              onClick={() => { 
                if (idx > 0) { 
                  setIdx(i => i - 1); 
                  setShowAnswer(false); 
                } 
              }} 
              disabled={idx === 0}
            >
              Previous
            </button>
            {idx < flashcards.length - 1 && !completed && (
              <button 
                className="btn btn-primary" 
                onClick={() => { 
                  setIdx(i => i + 1); 
                  setShowAnswer(false); 
                }}
              >
                Skip
              </button>
            )}
            {idx === flashcards.length - 1 && !completed && (
              <button className="btn btn-success" onClick={() => setCompleted(true)}>
                Finish
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Completion Modal */}
      {completed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg p-8 w-full max-w-md text-center flex flex-col items-center">
            <div className="text-2xl font-bold text-success mb-2">🎉 Study Session Complete!</div>
            <div className="text-base text-gray-600 dark:text-gray-300 mb-4">
              You've reviewed all cards in this deck.
            </div>
            
            {/* Study Statistics */}
            <div className="stats shadow mb-6 w-full">
              <div className="stat">
                <div className="stat-title">Time</div>
                <div className="stat-value text-lg">{getStudyDuration()} min</div>
              </div>
              <div className="stat">
                <div className="stat-title">Cards</div>
                <div className="stat-value text-lg">{studyStats.cardsReviewed}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Accuracy</div>
                <div className="stat-value text-lg">
                  {studyStats.cardsReviewed > 0 
                    ? Math.round((studyStats.correctAnswers / studyStats.cardsReviewed) * 100) 
                    : 0}%
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setIdx(0);
                  setShowAnswer(false);
                  setCompleted(false);
                  setStudyStats({
                    startTime: Date.now(),
                    cardsReviewed: 0,
                    correctAnswers: 0
                  });
                }}
              >
                Study Again
              </button>
              <button className="btn btn-accent" onClick={() => navigate(-1)}>
                Back to Deck
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Card flip CSS */}
      <style>{`
        .perspective { perspective: 1200px; } 
        .transform-style-preserve-3d { transform-style: preserve-3d; } 
        .backface-hidden { backface-visibility: hidden; } 
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}

export default StudyDeckPage;
