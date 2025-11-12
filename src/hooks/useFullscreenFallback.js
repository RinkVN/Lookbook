import { useEffect, useRef, useState, useCallback } from 'react';

function getFullscreenElement() {
    return (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement ||
        null
    );
}

export default function useFullscreenFallback() {
    const fullscreenRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const cleanupFallback = useCallback(() => {
        const el = fullscreenRef.current;
        if (el && el.dataset.fsFallback === 'true') {
            delete el.dataset.fsFallback;
        }
        document.documentElement.style.overflow = '';
    }, []);

    useEffect(() => {
        function handleFullscreenChange() {
            const fsElement = getFullscreenElement();
            const isNativeFullscreen = Boolean(fsElement);
            setIsFullscreen(isNativeFullscreen);

            if (!isNativeFullscreen) {
                cleanupFallback();
            }
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
            cleanupFallback();
        };
    }, [cleanupFallback]);

    const enter = useCallback(async () => {
        const el = fullscreenRef.current;
        if (!el) {
            return;
        }

        const request =
            el.requestFullscreen ||
            el.webkitRequestFullscreen ||
            el.mozRequestFullScreen ||
            el.msRequestFullscreen;

        if (request) {
            try {
                await request.call(el);
                return;
            } catch (error) {
                console.warn('requestFullscreen failed, applying fallback', error);
            }
        }

        el.dataset.fsFallback = 'true';
        document.documentElement.style.overflow = 'hidden';
        setIsFullscreen(true);
    }, []);

    const exit = useCallback(async () => {
        const docExit =
            document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.mozCancelFullScreen ||
            document.msExitFullscreen;

        const isNativeFullscreen = Boolean(getFullscreenElement());

        if (docExit && isNativeFullscreen) {
            try {
                await docExit.call(document);
                return;
            } catch (error) {
                console.warn('exitFullscreen failed, cleaning fallback', error);
            }
        }

        cleanupFallback();
        setIsFullscreen(false);
    }, [cleanupFallback]);

    return { fullscreenRef, isFullscreen, enter, exit };
}

