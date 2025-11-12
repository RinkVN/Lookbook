import React, { useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';

function BacHoBook() {
    // Tạo mảng các trang với ảnh từ 2.png đến 23.png
    const pages = Array.from({ length: 22 }, (_, i) => i + 2);
    const flipBook = useRef();

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
                width={794}
                height={1123}
                maxShadowOpacity={0.5}
                drawShadow={true}
                showCover={true}
                size="fixed"
                usePortrait={false}
                className="lookbook-flipbook"
            >
                {/* Trang bìa */}
                <div className="page" style={{ background: 'transparent' }}>
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
                        <div className="page" key={pageNum} style={{ background: 'transparent' }}>
                            <div className="page-content" style={{ padding: 0 }}>
                                {isVideo ? (
                                    <video
                                        src={`/LookbookHCM/${pageNum}.${fileExtension}`}
                                        autoPlay
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

