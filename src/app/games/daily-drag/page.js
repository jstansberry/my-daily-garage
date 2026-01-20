import DragRacingGame from './DragRacingGame';

export const metadata = {
    title: 'The Daily Drag | My Daily Garage',
    description: 'Test your reaction time and shifting skills in our daily drag racing challenge.',
};

export default function DragRacingPage() {
    return (
        <main className="min-h-screen bg-neutral-900 text-white">
            <DragRacingGame />
        </main>
    );
}
