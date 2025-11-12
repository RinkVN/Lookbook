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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const ActiveBook = openBookId ? bookComponents[openBookId] : null;
  const modalRef = React.useRef(null);

  const handleOpen = (book) => {
    if (book.interactive) {
      setOpenBookId(book.id);
    }
  };

  const handleClose = () => {
    // Thoát fullscreen trước khi đóng
    if (isFullscreen) {
      exitFullscreen();
    }
    setOpenBookId(null);
  };

  const enterFullscreen = async () => {
    const element = modalRef.current;

    if (!element) {
      console.error('Modal ref not found');
      return;
    }

    try {
      // Chrome ưu tiên requestFullscreen() chuẩn
      if (element.requestFullscreen) {
        await element.requestFullscreen();
        console.log('Fullscreen entered (standard API)');
      }
      // Fallback cho các trình duyệt khác
      else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
        console.log('Fullscreen entered (webkit)');
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
        console.log('Fullscreen entered (moz)');
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
        console.log('Fullscreen entered (ms)');
      } else {
        console.error('Fullscreen API not supported');
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
      // Nếu lỗi, thử với document.documentElement như fallback
      try {
        const docElement = document.documentElement;
        if (docElement.requestFullscreen) {
          await docElement.requestFullscreen();
          console.log('Fullscreen entered (fallback to documentElement)');
        }
      } catch (fallbackErr) {
        console.error('Fullscreen fallback error:', fallbackErr);
      }
    }
  };

  const exitFullscreen = async () => {
    try {
      // Chrome ưu tiên exitFullscreen() chuẩn
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        console.log('Fullscreen exited (standard API)');
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
        console.log('Fullscreen exited (webkit)');
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
        console.log('Fullscreen exited (moz)');
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
        console.log('Fullscreen exited (ms)');
      }
    } catch (err) {
      console.error('Exit fullscreen error:', err);
    }
  };

  const toggleFullscreen = async () => {
    try {
      // Chrome sử dụng fullscreenElement chuẩn
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      console.log('Toggle fullscreen - Current state:', isCurrentlyFullscreen);

      if (isCurrentlyFullscreen) {
        await exitFullscreen();
      } else {
        await enterFullscreen();
      }
    } catch (err) {
      console.error('Toggle fullscreen error:', err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && openBookId) {
        const isCurrentlyFullscreen = !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        );
        if (isCurrentlyFullscreen) {
          exitFullscreen();
        } else {
          handleClose();
        }
      }
    };

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
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

      <div
        className={`book-modal ${openBookId ? 'visible' : ''}`}
        ref={modalRef}
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
              console.log('Fullscreen button clicked');

              const element = modalRef.current;
              if (!element) {
                console.error('Modal ref not found');
                return;
              }

              try {
                // Kiểm tra trạng thái fullscreen hiện tại
                const isCurrentlyFullscreen = !!(
                  document.fullscreenElement ||
                  document.webkitFullscreenElement ||
                  document.mozFullScreenElement ||
                  document.msFullscreenElement
                );

                if (isCurrentlyFullscreen) {
                  // Thoát fullscreen
                  if (document.exitFullscreen) {
                    await document.exitFullscreen();
                  } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                  } else if (document.mozCancelFullScreen) {
                    await document.mozCancelFullScreen();
                  } else if (document.msExitFullscreen) {
                    await document.msExitFullscreen();
                  }
                } else {
                  // Vào fullscreen - Chrome ưu tiên API chuẩn
                  if (element.requestFullscreen) {
                    await element.requestFullscreen();
                    console.log('Fullscreen entered (Chrome standard API)');
                  } else if (element.webkitRequestFullscreen) {
                    await element.webkitRequestFullscreen();
                    console.log('Fullscreen entered (webkit)');
                  } else if (element.mozRequestFullScreen) {
                    await element.mozRequestFullScreen();
                    console.log('Fullscreen entered (moz)');
                  } else if (element.msRequestFullscreen) {
                    await element.msRequestFullscreen();
                    console.log('Fullscreen entered (ms)');
                  } else {
                    console.error('Fullscreen API not supported');
                  }
                }
              } catch (err) {
                console.error('Fullscreen error:', err);
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
