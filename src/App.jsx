import React, { useState, useEffect } from 'react';
import Lookbook from './components/Lookbook';
import BacHoBook from './components/BacHoBook';
import './App.css';

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

  const handleOpen = (book) => {
    if (book.interactive) {
      setOpenBookId(book.id);
    }
  };

  const handleClose = () => {
    setOpenBookId(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && openBookId) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openBookId]);

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

      <div className={`book-modal ${openBookId ? 'visible' : ''}`}>
        <div className="book-modal-overlay" onClick={handleClose} />
        <div className="book-modal-shell">
          <button className="modal-close" onClick={handleClose} aria-label="Đóng sách">
            ×
          </button>
          <div className="book-modal-content">{ActiveBook && <ActiveBook />}</div>
        </div>
      </div>
    </>
  );
}

export default App;
