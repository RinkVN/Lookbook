import React, { useState, useEffect, useCallback } from 'react';
import Lookbook from './components/Lookbook';
import BacHoBook from './components/BacHoBook';
import './App.css';
import useFullscreenFallback from './hooks/useFullscreenFallback';

const shelfBooks = [
  {
    id: 'lookbook',
    title: 'Thành cổ Quảng Trị',
    tag: 'Lookbook',
    year: '1972',
    accent: 'primary',
    interactive: true,
  },
  {
    id: 'memory',
    title: 'Bác Hồ',
    tag: 'Chân dung',
    year: '—',
    accent: 'neutral',
    interactive: true,
  },
  {
    id: 'river',
    title: 'Sông Thạch Hãn',
    tag: 'Ghi chép',
    year: '1972',
    accent: 'dark',
    interactive: false,
  },
];

const bookComponents = {
  lookbook: Lookbook,
  memory: BacHoBook,
};

function App() {
  const [openBookId, setOpenBookId] = useState(null);
  const ActiveBook = openBookId ? bookComponents[openBookId] : null;
  const { fullscreenRef, isFullscreen, enter, exit } = useFullscreenFallback();

  const handleOpen = (book) => {
    if (book.interactive) {
      setOpenBookId(book.id);
    }
  };

  const handleClose = useCallback(async () => {
    try {
      if (isFullscreen) {
        await exit();
      }
    } catch (error) {
      console.error('Exit fullscreen before close failed:', error);
    } finally {
      setOpenBookId(null);
    }
  }, [exit, isFullscreen]);

  useEffect(() => {
    if (!openBookId) {
      return undefined;
    }

    const handleKeyDown = async (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          await exit();
        } else {
          setOpenBookId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openBookId, isFullscreen, exit]);

  return (
    <>
      <div className={`bookshelf-scene ${openBookId ? 'book-open' : ''}`}>
        <div className="bookshelf">
          <div className="shelf-books">
            {shelfBooks.map((book) => (
              <button
                key={book.id}
                type="button"
                className={`book-cover book-cover--${book.accent} ${book.interactive ? 'book-cover--active' : 'book-cover--static'}`}
                onClick={() => handleOpen(book)}
                disabled={!book.interactive}
                style={
                  book.id === 'lookbook'
                    ? {
                      backgroundImage: 'url(/poster.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                    : book.id === 'memory'
                      ? {
                        background: 'url(/hcm.png) center / cover no-repeat',
                      }
                      : undefined
                }
              >
              </button>
            ))}
          </div>
          <div className="shelf-board" />
        </div>
      </div>

      <div
        className={`book-modal ${openBookId ? 'visible' : ''}`}
        ref={fullscreenRef}
      >
        <div className="book-modal-overlay" onClick={handleClose} />
        <div
          className="book-modal-shell"
        >
          <button className="modal-close" onClick={handleClose} aria-label="Đóng sách">
            ×
          </button>
          <button
            type="button"
            className="modal-fullscreen"
            onClick={async (e) => {
              e.stopPropagation();
              e.preventDefault();
              try {
                if (isFullscreen) {
                  await exit();
                } else {
                  await enter();
                }
              } catch (err) {
                console.error('Fullscreen toggle error:', err);
              }
            }}
            aria-label={isFullscreen ? 'Thoát toàn màn hình' : 'Phóng to toàn màn hình'}
          >
            {isFullscreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
          <div className="book-modal-content">{ActiveBook && <ActiveBook />}</div>
        </div>
      </div>
    </>
  );
}

export default App;
