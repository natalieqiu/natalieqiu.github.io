import React, { useRef, useState, useEffect } from 'react';

// Set your desired vw and vh values here!
const CANVAS_WIDTH_VW = 90; // 100vw = full width
const CANVAS_HEIGHT_VH = 80; // 80vh = 80% of viewport height

function DrawingCanvas() {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);

    // Convert vw/vh to px
    const getWidthPx = () => Math.round(window.innerWidth * (CANVAS_WIDTH_VW / 100));
    const getHeightPx = () => Math.round(window.innerHeight * (CANVAS_HEIGHT_VH / 100));

    // Resize canvas on mount and when the window resizes
    useEffect(() => {
        const setCanvasSize = () => {
            const canvas = canvasRef.current;
            canvas.width = getWidthPx();
            canvas.height = getHeightPx();
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);
        return () => window.removeEventListener('resize', setCanvasSize);
    }, []);

    const getCtx = () => canvasRef.current.getContext('2d');

    const handleMouseDown = (e) => {
        setDrawing(true);
        const ctx = getCtx();
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const handleMouseMove = (e) => {
        if (!drawing) return;
        const ctx = getCtx();
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const handleMouseUpOrOut = () => {
        setDrawing(false);
        getCtx().beginPath();
    };

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: `${CANVAS_WIDTH_VW}vw`,    // Visual size
                height: `${CANVAS_HEIGHT_VH}vh`,  // Visual size
                border: '1px solid #000',
                display: 'flex',
                position: 'fixed',
                top: `calc(50vh - ${CANVAS_HEIGHT_VH / 2}vh)`,
                left: `calc(50vw - ${CANVAS_WIDTH_VW / 2}vw)`,
                zIndex: 0,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrOut}
            onMouseLeave={handleMouseUpOrOut}
        />
    );
}

export default DrawingCanvas;