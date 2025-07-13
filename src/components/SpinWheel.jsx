import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Play } from 'lucide-react';

const SpinWheel = ({ names, onSpinComplete, onBackToSetup }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const getWheelColors = (index) => {
    const colors = [
      'hsl(340 80% 75%)', // Pink
      'hsl(280 70% 80%)', // Lavender
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
    <div className="flex flex-col items-center space-y-6">
      <Card className="bg-gradient-card shadow-vibrant border-0 p-6">
        <CardContent className="flex flex-col items-center space-y-6">
          {/* Wheel Container */}
          <div className="relative">
            {/* Pointer Arrow */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[16px] border-l-transparent border-r-transparent border-b-green-500 drop-shadow-md"></div>
            </div>
            
            {/* Wheel */}
            <div 
              className={`relative w-64 h-64 rounded-full overflow-hidden shadow-glow ${isSpinning ? 'animate-spin-wheel' : ''}`}
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
                const textRadius = 80; // Distance from center for text
                
                return (
                  <div key={index}>
                    {/* Segment divider line */}
                    <div
                      className="absolute w-0.5 bg-white/30 origin-bottom"
                      style={{
                        height: '128px',
                        left: '50%',
                        bottom: '50%',
                        transform: `translateX(-50%) rotate(${index * segmentAngle}deg)`,
                      }}
                    />
                    
                    {/* Name text */}
                    <div
                      className="absolute text-white font-bold text-sm pointer-events-none"
                      style={{
                        left: `${50 + (textRadius / 128) * 50 * Math.cos((angle - 90) * Math.PI / 180)}%`,
                        top: `${50 + (textRadius / 128) * 50 * Math.sin((angle - 90) * Math.PI / 180)}%`,
                        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                        whiteSpace: 'nowrap',
                        fontSize: names.length > 8 ? '10px' : names.length > 6 ? '12px' : '14px'
                      }}
                    >
                      {name}
                    </div>
                  </div>
                );
              })}
              
              {/* Center Spin Button */}
              <button
                onClick={spinWheel}
                disabled={isSpinning}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500 hover:bg-blue-600 disabled:opacity-75 rounded-full shadow-lg border-4 border-white z-20 flex items-center justify-center text-white font-bold text-sm transition-colors"
              >
                {isSpinning ? '...' : 'Spin'}
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <Button
              onClick={onBackToSetup}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Change Players
            </Button>
            
            <Button
              onClick={spinWheel}
              disabled={isSpinning}
              className="bg-gradient-primary hover:scale-105 transition-transform text-lg px-8 py-6 font-semibold shadow-glow"
            >
              <Play className="h-5 w-5 mr-2" />
              {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpinWheel;