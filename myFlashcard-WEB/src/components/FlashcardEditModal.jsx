import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import { getAllTags, createTag } from '../api/tag';
// import { fetchMyDecks } from '../api/deck';
import useAuthStore from '../store/auth-store';
import VirtualizedList from './VirtualizedList';

const FlashcardEditModal = ({ open, onClose, onSave, loading, initial }) => {
  const token = useAuthStore(state => state.token);
  const [question, setQuestion] = useState(initial?.question || '');
  const [answer, setAnswer] = useState(initial?.answer || '');
  const [detail, setDetail] = useState(initial?.detail || '');
  const [questionPic, setQuestionPic] = useState(null);
  const [answerPic, setAnswerPic] = useState(null);
  const [questionPicPreview, setQuestionPicPreview] = useState(initial?.questionPic || '');
  const [answerPicPreview, setAnswerPicPreview] = useState(initial?.answerPic || '');
  const [allTags, setAllTags] = useState([]);
  // const [allDecks, setAllDecks] = useState([]);
  // const [selectedDeck, setSelectedDeck] = useState(initial?.deckId ? String(initial.deckId) : '');
const extractTagIds = tags =>
  Array.isArray(tags)
    ? tags.map(t => {
        if (typeof t === 'object') {
          if (t.id) return t.id;
          if (t.tag && t.tag.id) return t.tag.id;
        }
        return t;
      })
    : [];
const [selectedTags, setSelectedTags] = useState(extractTagIds(initial?.tags));
  const [newTagName, setNewTagName] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [tagLoading, setTagLoading] = useState(false);
  useEffect(() => {
    if (open) {
      getAllTags().then(setAllTags).catch(() => setAllTags([]));
      // if (token) {
      //   fetchMyDecks(token)
      //     .then(data => setAllDecks(Array.isArray(data) ? data : []))
      //     .catch(() => setAllDecks([]));
      // }
    }
  }, [open, token]);
  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setTagLoading(true);
    try {
      // Check if tag already exists (case-insensitive)
      const existing = allTags.find(t => t.name.toLowerCase() === newTagName.trim().toLowerCase());
      if (existing) {
        setSelectedTags(prev => prev.includes(existing.id) ? prev : [...prev, existing.id]);
        setNewTagName("");
        setTagLoading(false);
        return;
      }
      const tag = await createTag(newTagName.trim());
      setAllTags(prev => [...prev, tag]);
      setSelectedTags(prev => [...prev, tag.id]);
      setNewTagName("");
    } catch {
      // Optionally show error
    }
    setTagLoading(false);
  };

  useEffect(() => {
    if (open) {
      setQuestion(initial?.question || '');
      setAnswer(initial?.answer || '');
      setDetail(initial?.detail || '');
      setQuestionPic(null);
      setAnswerPic(null);
      setQuestionPicPreview(initial?.questionPic || '');
      setAnswerPicPreview(initial?.answerPic || '');
      setSelectedTags(extractTagIds(initial?.tags));
      // setSelectedDeck(initial?.deckId ? String(initial.deckId) : '');
    }
  }, [open, initial]);


  const handleQuestionPicChange = (e) => {
    const file = e.target.files[0];
    setQuestionPic(file);
    if (file) {
      setQuestionPicPreview(URL.createObjectURL(file));
    } else {
      setQuestionPicPreview('');
    }
  };

  const handleRemoveQuestionPic = (e) => {
    e.preventDefault();
    setQuestionPic(null);
    setQuestionPicPreview('');
  };


  const handleAnswerPicChange = (e) => {
    const file = e.target.files[0];
    setAnswerPic(file);
    if (file) {
      setAnswerPicPreview(URL.createObjectURL(file));
    } else {
      setAnswerPicPreview('');
    }
  };

  const handleRemoveAnswerPic = (e) => {
    e.preventDefault();
    setAnswerPic(null);
    setAnswerPicPreview('');
  };

  const handleTagChange = (e) => {
    const value = Number(e.target.value);
    setSelectedTags(prev =>
      prev.includes(value)
        ? prev.filter(tag => tag !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Always pass either the file or the existing image URL
    onSave({
      question,
      answer,
      detail,
      questionPic: questionPic || questionPicPreview || '',
      answerPic: answerPic || answerPicPreview || '',
      tags: selectedTags
    });
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-base-200 p-6 rounded-xl shadow-xl w-full max-w-2xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto relative">
        <button
          type="button"
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="font-bold text-lg mb-2">{initial ? 'Edit' : 'Create'} Flashcard</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Question Side */}
            <div className="flex-1 flex flex-col gap-2 border border-base-300 rounded-lg p-2">
              <div className="font-semibold text-primary mb-1 text-center">Question</div>
              <input
                className="input input-bordered w-full"
                placeholder="Question"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                required
              />
              <ImageUpload
                file={questionPic}
                setFile={setQuestionPic}
                label="Question Image"
                previewUrl={questionPicPreview}
                setPreviewUrl={setQuestionPicPreview}
                disabled={loading}
              />
            </div>
            {/* Answer Side */}
            <div className="flex-1 flex flex-col gap-2 border border-base-300 rounded-lg p-2">
              <div className="font-semibold text-primary mb-1 text-center">Answer</div>
              <input
                className="input input-bordered w-full"
                placeholder="Answer"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                required
              />
              <ImageUpload
                file={answerPic}
                setFile={setAnswerPic}
                label="Answer Image"
                previewUrl={answerPicPreview}
                setPreviewUrl={setAnswerPicPreview}
                disabled={loading}
              />
            </div>
          </div>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Detail (optional)"
            value={detail}
            onChange={e => setDetail(e.target.value)}
            rows={2}
          />
          {/* Deck selection removed */}
          {/* Tag selection */}
          <div>
            <div className="font-semibold mb-1">Tags</div>
            <div className="mb-2 w-full">
              <input
                type="text"
                className="input input-sm input-bordered mb-2 w-full"
                placeholder="Search tags..."
                value={tagSearch}
                onChange={e => setTagSearch(e.target.value)}
                autoComplete="off"
              />
              <div style={{maxHeight: '76px', overflowY: 'auto'}}>
                {allTags.length === 0 ? (
                  <span className="text-gray-400 text-sm">No tags found</span>
                ) : (
                  <div className="flex flex-row flex-wrap gap-2" style={{minHeight: '36px'}}>
                    {(() => {
                      // Always show selected tags first, then up to 20 (unique) tags matching search
                      const filtered = allTags.filter(tag => tag.name.toLowerCase().includes(tagSearch.toLowerCase()));
                      const selectedTagObjs = allTags.filter(tag => selectedTags.includes(tag.id));
                      // Remove selected tags from filtered list to avoid duplicates
                      const unselectedFiltered = filtered.filter(tag => !selectedTags.includes(tag.id));
                      // Limit to 20: always show all selected, then fill up to 20 with unselected
                      const displayTags = [...selectedTagObjs, ...unselectedFiltered].slice(0, 20);
                      return displayTags.map(tag => {
                        const selected = selectedTags.includes(tag.id);
                        const disableAdd = !selected && selectedTags.length >= 20;
                        return (
                          <div
                            key={tag.id}
                            className={
                              `cursor-pointer px-3 py-1 rounded-full transition-all text-xs font-semibold ` +
                              (selected
                                ? 'bg-primary text-white shadow ring-2 ring-primary/70'
                                : disableAdd
                                  ? 'bg-base-200 text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed'
                                  : 'bg-base-200 text-gray-100 dark:text-gray-200 hover:bg-primary/10')
                            }
                            onClick={() => {
                              if (selected) {
                                setSelectedTags(prev => prev.filter(tid => tid !== tag.id));
                              } else if (!disableAdd) {
                                setSelectedTags(prev => [...prev, tag.id]);
                              }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-pressed={selected}
                            style={{marginBottom: 2}}
                            title={disableAdd ? 'You can select up to 20 tags' : tag.name}
                          >
                            {tag.name}
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                className="input input-sm input-bordered"
                placeholder="New tag name"
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                disabled={tagLoading || loading}
                autoComplete="off"
              />
              <button
                type="button"
                className="btn btn-sm btn-primary"
                disabled={tagLoading || loading || !newTagName.trim()}
                onClick={handleCreateTag}
              >Add</button>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>Close</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{initial ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlashcardEditModal;
