import React, { useRef, useEffect, useState } from 'react'
import HTMLFlipBook from "react-pageflip";

function Lookbook() {
  // Tạo mảng các trang với ảnh từ 2.png đến 27.png
  const pages = Array.from({ length: 26 }, (_, i) => i + 2);
  const flipBook = useRef();
  const videoRefs = useRef({});
  const wrapperRef = useRef(null);

  // Tỷ lệ gốc của sách
  const originalWidth = 794;
  const originalHeight = 1123;
  const aspectRatio = originalWidth / originalHeight;

  const [bookSize, setBookSize] = useState({
    width: originalWidth,
    height: originalHeight
  });

  // Tính toán kích thước sách dựa trên viewport
  const calculateBookSize = () => {
    if (!wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const wrapperRect = wrapper.getBoundingClientRect();

    // Xác định padding dựa trên kích thước màn hình
    const isMobile = window.innerWidth <= 768;
    const padding = isMobile ? 60 : 100; // Padding lớn hơn cho mobile

    const availableWidth = wrapperRect.width - padding;
    const availableHeight = wrapperRect.height - padding;

    let newWidth, newHeight;

    // Tính toán để fit vào viewport nhưng giữ tỷ lệ
    if (availableWidth / availableHeight > aspectRatio) {
      // Viewport rộng hơn, fit theo chiều cao
      newHeight = Math.min(availableHeight, originalHeight);
      newWidth = newHeight * aspectRatio;
    } else {
      // Viewport cao hơn, fit theo chiều rộng
      newWidth = Math.min(availableWidth, originalWidth);
      newHeight = newWidth / aspectRatio;
    }

    // Thêm hệ số scale down để sách không quá to (0.85 = 85% kích thước tính được)
    const scaleFactor = isMobile ? 0.8 : 0.85;
    newWidth = newWidth * scaleFactor;
    newHeight = newHeight * scaleFactor;

    // Đảm bảo không vượt quá kích thước gốc
    newWidth = Math.min(newWidth, originalWidth);
    newHeight = Math.min(newHeight, originalHeight);

    setBookSize({ width: Math.round(newWidth), height: Math.round(newHeight) });
  };

  useEffect(() => {
    // Delay nhỏ để đảm bảo DOM đã render
    const timer = setTimeout(() => {
      calculateBookSize();
    }, 100);

    const handleResize = () => {
      // Delay sau khi resize để viewport ổn định
      setTimeout(() => {
        calculateBookSize();
      }, 100);
    };

    const handleOrientationChange = () => {
      // Delay lâu hơn cho orientation change
      setTimeout(() => {
        calculateBookSize();
      }, 300);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Cập nhật lại khi modal mở (nếu có)
    const observer = new MutationObserver(() => {
      calculateBookSize();
    });

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: false,
        subtree: false
      });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        flipBook.current?.pageFlip()?.flipPrev();
      } else if (e.key === 'ArrowRight') {
        flipBook.current?.pageFlip()?.flipNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="lookbook-wrapper" ref={wrapperRef}>
      <HTMLFlipBook
        ref={flipBook}
        width={bookSize.width}
        height={bookSize.height}
        maxShadowOpacity={0.5}
        drawShadow={true}
        showCover={true}
        size='fixed'
        usePortrait={false}
        className="lookbook-flipbook"
      >
        {/* Trang bìa */}
        <div className="page" style={{ background: 'transparent' }}>
          <div className="page-content" style={{ padding: 0 }}>
            <img
              src="/poster.jpg"
              alt="Thành cổ Quảng Trị - Poster"
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
            />
          </div>
        </div>

        {/* Các trang nội dung - chỉ hiển thị ảnh toàn trang */}
        {pages.map((pageNum) => {
          // Kiểm tra xem file là video (.mp4) hay ảnh (.png)
          const isVideo = pageNum === 26 || pageNum === 27;
          const fileExtension = isVideo ? 'mp4' : 'png';

          return (
            <div className="page" key={pageNum} style={{ background: 'transparent' }}>
              <div className="page-content" style={{ padding: 0 }}>
                {isVideo ? (
                  <video
                    ref={(el) => {
                      if (el) {
                        videoRefs.current[pageNum] = el;
                        // Tạo observer ngay khi video được mount
                        const observer = new IntersectionObserver(
                          (entries) => {
                            entries.forEach((entry) => {
                              if (entry.isIntersecting) {
                                el.play().catch((err) => {
                                  console.log('Video play failed:', err);
                                });
                              } else {
                                el.pause();
                              }
                            });
                          },
                          { threshold: 0.5 }
                        );
                        observer.observe(el);
                        // Lưu observer để cleanup sau
                        if (!el._observer) {
                          el._observer = observer;
                        }
                      } else if (videoRefs.current[pageNum]?._observer) {
                        videoRefs.current[pageNum]._observer.disconnect();
                        delete videoRefs.current[pageNum];
                      }
                    }}
                    src={`/Lookbook/${pageNum}.${fileExtension}`}
                    loop
                    playsInline
                    controls
                    style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                  />
                ) : (
                  <img
                    src={`/Lookbook/${pageNum}.${fileExtension}`}
                    alt={`Trang ${pageNum}`}
                    style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </HTMLFlipBook>
    </div>
  );
}

export default Lookbook