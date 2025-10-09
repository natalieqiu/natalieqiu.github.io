// src/App.jsx
import React, { useRef, useEffect } from 'react';
import './styles.css';
import DrawingCanvas from './components/DrawingCanvas';

function DrawingCanvas2() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        let drawing = false;

        function startDrawing(e) {
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        }

        function draw(e) {
            if (!drawing) return;
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            ctx.stroke();
        }

        function stopDrawing() {
            drawing = false;
            ctx.beginPath();
        }

        // Event listeners
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Cleanup
        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ border: '1px solid #000' }} />;
}

function App() {
    return (
        <div>
            <header>
                <h1>My Web Projects</h1>
            </header>
            <DrawingCanvas/>
            <div className="project-grid">
                <a href="/react-init-tracker/" className="project-card">
                    <h2>React Init Tracker</h2>
                    <p>Inspired by Octopath. For all your TTRPG needs.</p>
                    <small>Framework: React</small>
                </a>
            </div>
        </div>
    );
}

export default App;