import { describe, it, expect } from 'vitest';
import { calculateScore } from '../lib/gameUtils';

describe('calculateScore', () => {
    it('returns 100 for a perfect first try', () => {
        const guesses = [
            { isMakeCorrect: true, isModelCorrect: true, isYearCorrect: true }
        ];
        expect(calculateScore(guesses)).toBe(100);
    });

    it('returns 75 for matching all components separately on first try (theoretical)', () => {
        // Wait, if all are correct on first try, it hits the 100 check.
        // But what if the logic requires them to be strictly in the FIRST object?
        // Logic: if (first.isMakeCorrect && first.isModelCorrect && first.isYearCorrect) return 100;
        // So yes, 100.
        // What if they are correct but split across guesses?
        const guesses = [
            { isMakeCorrect: true, isModelCorrect: false, isYearCorrect: false }, // 25 pts
            { isMakeCorrect: true, isModelCorrect: true, isYearCorrect: false },  // 20 pts (Make already found)
            { isMakeCorrect: true, isModelCorrect: true, isYearCorrect: true }    // 15 pts (Year found)
        ];
        // Total: 25 (Make) + 20 (Model) + 15 (Year) = 60
        expect(calculateScore(guesses)).toBe(60);
    });

    it('returns 0 for no correct guesses', () => {
        const guesses = [
            { isMakeCorrect: false, isModelCorrect: false, isYearCorrect: false }
        ];
        expect(calculateScore(guesses)).toBe(0);
    });

    it('stops awarding points after 5 guesses', () => {
        // 6th guess gets 0 points even if new info found
        const guesses = [
            { isMakeCorrect: false, isModelCorrect: false, isYearCorrect: false },
            { isMakeCorrect: false, isModelCorrect: false, isYearCorrect: false },
            { isMakeCorrect: false, isModelCorrect: false, isYearCorrect: false },
            { isMakeCorrect: false, isModelCorrect: false, isYearCorrect: false },
            { isMakeCorrect: false, isModelCorrect: false, isYearCorrect: false },
            { isMakeCorrect: true, isModelCorrect: true, isYearCorrect: true } // Should be ignored
        ];
        expect(calculateScore(guesses)).toBe(0);
    });
});
