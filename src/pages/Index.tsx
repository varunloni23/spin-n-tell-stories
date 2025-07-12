import { useState, useEffect } from 'react';
import NameInputForm from '../components/NameInputForm';
import SpinWheel from '../components/SpinWheel';
import TruthOrDareModal from '../components/TruthOrDareModal';

const Index = () => {
  const [gameState, setGameState] = useState('setup'); // 'setup', 'wheel', 'modal'
  const [names, setNames] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState({ player1: '', player2: '' });
  const [customQuestions, setCustomQuestions] = useState({ truth: [], dare: [] });

  // Load custom questions from localStorage on component mount
  useEffect(() => {
    const savedQuestions = localStorage.getItem('truthSpinCustomQuestions');
    if (savedQuestions) {
      setCustomQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  const startGame = () => {
    setGameState('wheel');
  };

  const handleSpinComplete = (player1, player2) => {
    setSelectedPlayers({ player1, player2 });
    setGameState('modal');
  };

  const closeModal = () => {
    setGameState('wheel');
  };

  const backToSetup = () => {
    setGameState('setup');
    setNames([]);
    setSelectedPlayers({ player1: '', player2: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 animate-bounce-in">
            TruthSpin 🎯
          </h1>
          <p className="text-xl text-muted-foreground">
            The ultimate Truth or Dare wheel game!
          </p>
        </div>

        {/* Game Content */}
        <div className="flex justify-center">
          {gameState === 'setup' && (
            <NameInputForm 
              names={names}
              setNames={setNames}
              onStartGame={startGame}
            />
          )}
          
          {gameState === 'wheel' && (
            <SpinWheel 
              names={names}
              onSpinComplete={handleSpinComplete}
              onBackToSetup={backToSetup}
            />
          )}
        </div>

        {/* Modal */}
        <TruthOrDareModal
          isOpen={gameState === 'modal'}
          onClose={closeModal}
          player1={selectedPlayers.player1}
          player2={selectedPlayers.player2}
          customQuestions={customQuestions}
          setCustomQuestions={setCustomQuestions}
        />
      </div>
    </div>
  );
};

export default Index;
