import React, { useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';

function BacHoBook() {
    // Tạo mảng các trang với ảnh từ 2.png đến 23.png
    const pages = Array.from({ length: 22 }, (_, i) => i + 2);
    const flipBook = useRef();
    const videoRefs = useRef({});

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
        <div className="lookbook-wrapper">
            <HTMLFlipBook
                ref={flipBook}
                width={596}
                height={842}
                maxShadowOpacity={0.5}
                drawShadow={true}
                showCover={true}
                size="fixed"
                usePortrait={false}
                className="lookbook-flipbook"
            >
                {/* Trang bìa */}
                <div
                    className="page"
                    style={{ background: 'transparent' }}
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX || (e.touches && e.touches[0]?.clientX) || (e.changedTouches && e.changedTouches[0]?.clientX);
                        if (clickX) {
                            const pageWidth = rect.width;
                            const clickPosition = clickX - rect.left;
                            if (clickPosition > pageWidth / 2) {
                                flipBook.current?.pageFlip()?.flipNext();
                            }
                        }
                    }}
                    onTouchEnd={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const touch = e.changedTouches[0];
                        if (touch) {
                            const pageWidth = rect.width;
                            const touchPosition = touch.clientX - rect.left;
                            if (touchPosition > pageWidth / 2) {
                                e.preventDefault();
                                flipBook.current?.pageFlip()?.flipNext();
                            }
                        }
                    }}
                >
                    <div className="page-content" style={{ padding: 0 }}>
                        <img
                            src="/hcm.png"
                            alt="Chân dung Chủ tịch Hồ Chí Minh"
                            style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                        />
                    </div>
                </div>

                {/* Các trang nội dung - chỉ hiển thị ảnh toàn trang */}
                {pages.map((pageNum) => {
                    // Kiểm tra xem file là video (.mp4) hay ảnh (.png)
                    const isVideo = pageNum === 18 || pageNum === 21 || pageNum === 23;
                    const fileExtension = isVideo ? 'mp4' : 'png';

                    return (
                        <div
                            className="page"
                            key={pageNum}
                            style={{ background: 'transparent' }}
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickX = e.clientX || (e.touches && e.touches[0]?.clientX) || (e.changedTouches && e.changedTouches[0]?.clientX);
                                if (clickX) {
                                    const pageWidth = rect.width;
                                    const clickPosition = clickX - rect.left;
                                    if (clickPosition > pageWidth / 2) {
                                        flipBook.current?.pageFlip()?.flipNext();
                                    } else {
                                        flipBook.current?.pageFlip()?.flipPrev();
                                    }
                                }
                            }}
                            onTouchEnd={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const touch = e.changedTouches[0];
                                if (touch) {
                                    const pageWidth = rect.width;
                                    const touchPosition = touch.clientX - rect.left;
                                    if (touchPosition > pageWidth / 2) {
                                        e.preventDefault();
                                        flipBook.current?.pageFlip()?.flipNext();
                                    } else {
                                        e.preventDefault();
                                        flipBook.current?.pageFlip()?.flipPrev();
                                    }
                                }
                            }}
                        >
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
                                        src={`/LookbookHCM/${pageNum}.${fileExtension}`}
                                        loop
                                        playsInline
                                        controls
                                        style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                                    />
                                ) : (
                                    <img
                                        src={`/LookbookHCM/${pageNum}.${fileExtension}`}
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

export default BacHoBook;

