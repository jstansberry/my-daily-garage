import { useEffect, useRef } from 'react';

export default function useSoundManager(enabled) {
    const audioRefs = useRef({});

    // Define sounds
    const sounds = {
        stage: '/sounds/stage.mp3', // Click/Clunk
        tree: '/sounds/tree.mp3',   // Beep beep beep
        launch: '/sounds/launch.mp3', // Roar
        shift: '/sounds/shift.mp3', // Air shifter sound
        win: '/sounds/win.mp3',
        loss: '/sounds/lose.mp3',
        idle: '/sounds/idle.mp3' // Loop?
    };

    useEffect(() => {
        // Preload sounds
        Object.keys(sounds).forEach(key => {
            const audio = new Audio(sounds[key]);
            audio.volume = 0.5;
            audioRefs.current[key] = audio;
        });

        // Cleanup
        return () => {
            Object.values(audioRefs.current).forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        };
    }, []);

    const play = (soundName) => {
        if (!enabled) return;

        const audio = audioRefs.current[soundName];
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Audio play failed (user interaction needed?):", e));
        }
    };

    const stopAll = () => {
        Object.values(audioRefs.current).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    };

    return { play, stopAll };
}
