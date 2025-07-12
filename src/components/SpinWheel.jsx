import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Play } from 'lucide-react';

const SpinWheel = ({ names, onSpinComplete, onBackToSetup }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const getWheelColors = (index) => {
    const colors = [
      'hsl(280 100% 70%)', // Primary purple
      'hsl(320 100% 75%)', // Secondary pink  
      'hsl(200 100% 70%)', // Accent blue
      'hsl(120 100% 70%)', // Green
      'hsl(60 100% 70%)',  // Yellow
      'hsl(0 100% 70%)',   // Red
      'hsl(180 100% 70%)', // Cyan
      'hsl(270 100% 80%)', // Light purple
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
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary"></div>
            </div>
            
            {/* Wheel */}
            <div 
              className={`relative w-64 h-64 rounded-full overflow-hidden shadow-glow ${isSpinning ? 'animate-spin-wheel' : ''}`}
              style={{ 
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'none' : 'transform 0.3s ease-out'
              }}
            >
              {names.map((name, index) => {
                const startAngle = index * segmentAngle;
                const endAngle = (index + 1) * segmentAngle;
                const midAngle = (startAngle + endAngle) / 2;
                
                return (
                  <div
                    key={index}
                    className="absolute w-full h-full"
                    style={{
                      clipPath: `polygon(50% 50%, ${
                        50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)
                      }% ${
                        50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)
                      }%, ${
                        50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180)
                      }% ${
                        50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180)
                      }%)`,
                      backgroundColor: getWheelColors(index),
                    }}
                  >
                    <div
                      className="absolute text-white font-semibold text-sm"
                      style={{
                        left: `${50 + 35 * Math.cos((midAngle - 90) * Math.PI / 180)}%`,
                        top: `${50 + 35 * Math.sin((midAngle - 90) * Math.PI / 180)}%`,
                        transform: `translate(-50%, -50%) rotate(${midAngle}deg)`,
                        transformOrigin: 'center',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {name}
                    </div>
                  </div>
                );
              })}
              
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-4 border-primary"></div>
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