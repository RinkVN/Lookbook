import React from 'react'
import HTMLFlipBook from "react-pageflip";

function Book() {

  const lookbookPages = [
    { id: 1, section: "Dẫn nhập", title: "", imageUrl: "", imageCaption: "", quote: "", description: "" },
    { id: 2, section: "Thành cổ trong lửa đạn", title: "", imageUrl: "", imageCaption: "", quote: "", description: "" },
    { id: 3, section: "Thành cổ trong lửa đạn", title: "", imageUrl: "", imageCaption: "", quote: "", description: "" },
    { id: 4, section: "Cuộc sống trong tàn tích", title: "", imageUrl: "", imageCaption: "", quote: "", description: "" },
    { id: 5, section: "Cuộc sống trong tàn tích", title: "", imageUrl: "", imageCaption: "", quote: "", description: "" },
    { id: 6, section: "Tình đồng chí và hy sinh", title: "", imageUrl: "", imageCaption: "", quote: "", description: "" },
    { id: 7, section: "Tình đồng chí và hy sinh", title: "", imageUrl: "", imageCaption: "", quote: "", description: "" },
    { id: 8, section: "Ngày chiến thắng", title: "", imageUrl: "", imageCaption: "", quote: "", description: "" },
    { id: 9, section: "Ngày chiến thắng", title: "", imageUrl: "", imageCaption: "", quote: "", description: "" },
    { id: 10, section: "Hòa bình hôm nay", title: "", imageUrl: "", imageCaption: "", quote: "", description: "" }
  ];

  const renderWithPlaceholder = (value, placeholder) => {
    if (value && value.trim().length > 0) {
      return value;
    }
    return placeholder;
  };

  return (
    <div className="lookbook-wrapper">
      <HTMLFlipBook
        width={540}
        height={720}
        maxShadowOpacity={0.5}
        drawShadow={true}
        showCover={true}
        size='fixed'
        usePortrait={false}
        className="lookbook-flipbook"
      >
        <div className="page" style={{ background: 'transparent' }}>
          <div className="page-content" style={{ padding: 0 }}>
            <img
              src="/poster.jpg"
              alt="Thành cổ Quảng Trị - Poster"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {lookbookPages.map((page) => (
          <div className="page" key={page.id}>
            <div className="page-content lookbook-page">
              <header className="lookbook-header">
                <div className="lookbook-header-top">
                  <span className="lookbook-section">{page.section}</span>
                  <span className="lookbook-id">{page.id.toString().padStart(2, '0')}</span>
                </div>
                <h2 className="lookbook-title">
                  {renderWithPlaceholder(page.title, "Tiêu đề (3–6 chữ)")}
                </h2>
              </header>
              <section className="lookbook-body">
                <div className="lookbook-image-frame">
                  {page.imageUrl ? (
                    <img src={page.imageUrl} alt={page.title || `Trang ${page.id}`} />
                  ) : (
                    <div className="lookbook-image-placeholder">
                      <span>Thêm ảnh hoặc minh họa</span>
                      <small>Gợi ý: góc máy cinematic, ánh sáng tương phản</small>
                    </div>
                  )}
                </div>
                <p className="lookbook-image-note">
                  {renderWithPlaceholder(page.imageCaption, "Mô tả hình ảnh / ghi chú bối cảnh")}
                </p>
                <blockquote className="lookbook-quote">
                  “{renderWithPlaceholder(page.quote, "Trích dẫn cảm xúc ngắn")}”
                </blockquote>
                <p className="lookbook-description">
                  {renderWithPlaceholder(
                    page.description,
                    "Thêm 3–5 câu mô tả bối cảnh, cảm xúc, sự hy sinh hoặc chiến thắng."
                  )}
                </p>
              </section>
            </div>
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}

export default Book