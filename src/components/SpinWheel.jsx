import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Play } from 'lucide-react';

const SpinWheel = ({ names, onSpinComplete, onBackToSetup }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const getWheelColors = (index) => {
    const colors = [
      'hsl(270 91% 65%)', // Purple
      'hsl(190 84% 55%)', // Teal  
      'hsl(330 81% 60%)', // Pink
      'hsl(250 84% 54%)', // Blue
    ];
    return colors[index % colors.length];
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Random rotation between 1440-2160 degrees (4-6 full spins)
    const newRotation = rotation + 1440 + Math.random() * 720;
    setRotation(newRotation);
    
    setTimeout(() => {
      // Calculate which segment we landed on
      const normalizedRotation = newRotation % 360;
      const segmentAngle = 360 / names.length;
      const selectedIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % names.length;
      
      // Select two different players
      let secondIndex;
      do {
        secondIndex = Math.floor(Math.random() * names.length);
      } while (secondIndex === selectedIndex && names.length > 1);
      
      const player1 = names[selectedIndex];
      const player2 = names[secondIndex];
      
      setIsSpinning(false);
      onSpinComplete(player1, player2);
    }, 4000);
  };

  const segmentAngle = 360 / names.length;

  return (
    <div className="flex flex-col items-center space-y-8 min-h-screen bg-white p-6">
      {/* Header */}
      <div className="text-center mt-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white text-xl">✨</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">TruthSpin</h1>
        </div>
        <p className="text-gray-500">The ultimate truth or dare experience</p>
      </div>

      {/* Wheel Container */}
      <div className="relative">
        {/* Orange Diamond Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-4 h-4 bg-orange-500 transform rotate-45 shadow-lg"></div>
        </div>
            
        {/* Wheel */}
        <div 
          className={`relative w-80 h-80 rounded-full shadow-2xl ${isSpinning ? 'animate-spin-wheel' : ''}`}
          style={{ 
            transform: isSpinning ? 'none' : `rotate(${rotation}deg)`,
            transition: isSpinning ? 'none' : 'transform 0.3s ease-out',
            animationFillMode: isSpinning ? 'forwards' : 'none',
            background: names.length > 0 ? `conic-gradient(${names.map((_, index) => {
              const startPercent = (index / names.length) * 100;
              const endPercent = ((index + 1) / names.length) * 100;
              return `${getWheelColors(index)} ${startPercent}% ${endPercent}%`;
            }).join(', ')})` : getWheelColors(0)
          }}
        >
          {/* Segment lines and text */}
          {names.map((name, index) => {
            const angle = (index * segmentAngle) + (segmentAngle / 2);
            const textRadius = 100; // Distance from center for text
            
            return (
              <div key={index}>
                {/* Segment divider line */}
                <div
                  className="absolute w-0.5 bg-white/20 origin-bottom"
                  style={{
                    height: '160px',
                    left: '50%',
                    bottom: '50%',
                    transform: `translateX(-50%) rotate(${index * segmentAngle}deg)`,
                  }}
                />
                
                {/* Name text */}
                <div
                  className="absolute text-white font-semibold pointer-events-none"
                  style={{
                    left: `${50 + (textRadius / 160) * 50 * Math.cos((angle - 90) * Math.PI / 180)}%`,
                    top: `${50 + (textRadius / 160) * 50 * Math.sin((angle - 90) * Math.PI / 180)}%`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap',
                    fontSize: names.length > 6 ? '14px' : names.length > 4 ? '16px' : '18px'
                  }}
                >
                  {name}
                </div>
              </div>
            );
          })}
              
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg border-2 border-gray-100 z-20 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className="w-72 h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-75 rounded-2xl shadow-lg text-white font-semibold text-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105"
      >
        {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>

      {/* Players Section */}
      <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">👥</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Players</h3>
              <p className="text-sm text-gray-500">Add friends to start the game</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{names.length}</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <Button
        onClick={onBackToSetup}
        variant="outline"
        className="mt-4 border-gray-200 text-gray-600 hover:bg-gray-50"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Change Players
      </Button>
    </div>
  );
};

export default SpinWheel;