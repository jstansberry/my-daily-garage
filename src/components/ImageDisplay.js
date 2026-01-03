import React, { useState } from 'react';

const ImageDisplay = ({ imageUrl, zoomLevel, gameStatus, transformOrigin, maxZoom }) => {
    const [isEnlarged, setIsEnlarged] = useState(false);

    // Zoom levels: 1 (closest) to 5 (furthest/full image)
    const getScale = () => {
        // If we lost or won (game over), show full image
        if (gameStatus !== 'playing') return 1;

        const guessCount = zoomLevel;
        let scale = maxZoom || 5;

        // Progressive Zoom Logic:
        // Start with 10% reduction, increase reduction by 2.5% each step
        // e.g., 10%, 12.5%, 15%, 17.5%, 20%
        let currentReduction = 0.90; // Factor for 10% reduction
        const progression = 0.025;   // 2.5% change

        for (let i = 0; i < guessCount; i++) {
            scale = scale * currentReduction;
            currentReduction -= progression; // Decrease factor = Increase zoom-out
        }

        return Math.max(scale, 1);
    };

    const toggleEnlarge = () => {
        setIsEnlarged(!isEnlarged);
    };

    const currentScale = getScale();

    return (
        <div style={styles.container}>
            <div
                style={{
                    ...styles.imageWrapper,
                    cursor: 'pointer',
                    transform: isEnlarged ? 'scale(1.5)' : 'scale(1)',
                    transition: 'transform 0.3s ease-in-out',
                    zIndex: isEnlarged ? 100 : 1
                }}
                onClick={toggleEnlarge}
            >
                <div style={{
                    ...styles.cropFrame,
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                }}>
                    <img
                        src={imageUrl}
                        alt="Guess the car"
                        draggable="false"
                        onDragStart={(e) => e.preventDefault()}
                        onContextMenu={(e) => e.preventDefault()}
                        style={{
                            ...styles.image,
                            transform: `scale(${currentScale})`,
                            // Use custom transform origin if provided, otherwise default to center
                            transformOrigin: transformOrigin || 'center center',
                            pointerEvents: 'none', // Allow clicks to pass through to wrapper, prevents dragging interaction
                        }}
                    />
                </div>
            </div>
            <div style={styles.hint}>
                Click image to enlarge
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
    },
    imageWrapper: {
        width: '300px',
        height: '200px',
        overflow: 'hidden',
        border: '2px solid #ccc',
        borderRadius: '8px',
        position: 'relative',
        backgroundColor: '#000',
    },
    cropFrame: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Or contain, depending on source image quality
        transition: 'transform 0.5s ease',
    },
    hint: {
        marginTop: '8px',
        fontSize: '0.8rem',
        color: '#FFFFFF',
    }
};

export default ImageDisplay;
