import GameContainer from '../components/GameContainer';
import GrandPrixLeaderboard from '../components/GrandPrixLeaderboard';

export default function Home() {
    return (
        <div className="main-container">
            <div className="game-column">
                <GameContainer />
            </div>

            <div className="sidebar-column">
                <GrandPrixLeaderboard />
            </div>
        </div>
    );
}
