export const calculateScore = (finalGuesses) => {
    // Perfect First Try (All 3 correct on first guess)
    if (finalGuesses.length > 0) {
        const first = finalGuesses[0];
        if (first.isMakeCorrect && first.isModelCorrect && first.isYearCorrect) {
            return 100;
        }
    }

    let score = 0;
    const found = { make: false, model: false, year: false };
    const pointsMap = [25, 20, 15, 10, 5];

    finalGuesses.forEach((g, index) => {
        if (index > 4) return; // Max 5 attempts for points
        const pts = pointsMap[index];

        if (!found.make && g.isMakeCorrect) {
            score += pts;
            found.make = true;
        }
        if (!found.model && g.isModelCorrect) {
            score += pts;
            found.model = true;
        }
        if (!found.year && g.isYearCorrect) {
            score += pts;
            found.year = true;
        }
    });

    return score;
};
