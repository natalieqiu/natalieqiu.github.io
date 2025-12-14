import React, { useRef, useState, useEffect } from 'react';

// Set your desired vw and vh values here!
const CANVAS_WIDTH_VW = 90; // 100vw = full width
const CANVAS_HEIGHT_VH = 80; // 80vh = 80% of viewport height

function DrawingCanvas() {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);

    const [color, setColor] = useState('#000000');

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
        ctx.strokeStyle= color;
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const handleMouseMove = (e) => {
        if (!drawing) return;
        const ctx = getCtx();
        ctx.strokeStyle= color;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const handleMouseUpOrOut = () => {
        setDrawing(false);
        getCtx().beginPath();
    };

    function getCursorSvg(color, size = 24) {
        const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${color}" stroke="#fff" stroke-width="2"/>
      </svg>
    `;
        return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}') ${size/2} ${size/2}, pointer`;
    }

    return (
        <>

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
                    cursor: getCursorSvg(color, 24),
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrOut}
                onMouseLeave={handleMouseUpOrOut}
            />
            <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            //style={{ marginBottom: '10px' }}
        />
        </>

    );
}

export default DrawingCanvas;