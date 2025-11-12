import React, { useEffect, useRef, useState } from 'react';

const TRANSPARENT_PIXEL =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

function LazyImage({ src, alt, priority = false, onLoad, style, ...rest }) {
    const imgRef = useRef(null);
    const [isVisible, setIsVisible] = useState(Boolean(priority));
    const [isLoaded, setIsLoaded] = useState(Boolean(priority));

    useEffect(() => {
        if (isVisible) {
            return undefined;
        }

        const element = imgRef.current;
        if (!element) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin: '200px 0px', threshold: 0.01 }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [isVisible]);

    const handleLoad = (event) => {
        setIsLoaded(true);
        if (onLoad) {
            onLoad(event);
        }
    };

    const mergedStyle = {
        ...style,
        opacity: isLoaded ? 1 : 0,
        transition: style?.transition ? style.transition : 'opacity 0.3s ease',
    };

    return (
        <img
            ref={imgRef}
            src={isVisible ? src : TRANSPARENT_PIXEL}
            data-src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            style={mergedStyle}
            onLoad={handleLoad}
            {...rest}
        />
    );
}

export default React.memo(LazyImage);

