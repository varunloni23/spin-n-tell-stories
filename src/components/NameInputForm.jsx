import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Users } from 'lucide-react';

const NameInputForm = ({ names, setNames, onStartGame }) => {
  const [currentName, setCurrentName] = useState('');

  const addName = () => {
    if (currentName.trim() && !names.includes(currentName.trim())) {
      setNames([...names, currentName.trim()]);
      setCurrentName('');
    }
  };

  const removeName = (nameToRemove) => {
    setNames(names.filter(name => name !== nameToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addName();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-card shadow-vibrant border-0">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Add Players
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter player name..."
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-2 border-border focus:border-primary transition-colors"
          />
          <Button 
            onClick={addName}
            className="bg-gradient-primary hover:scale-105 transition-transform"
            disabled={!currentName.trim() || names.includes(currentName.trim())}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {names.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {names.map((name) => (
                <Badge 
                  key={name} 
                  variant="secondary" 
                  className="text-sm py-1 px-3 bg-secondary/80 hover:bg-secondary transition-colors group"
                >
                  {name}
                  <button 
                    onClick={() => removeName(name)}
                    className="ml-2 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            
            <Button 
              onClick={onStartGame}
              disabled={names.length < 2}
              className="w-full bg-gradient-primary hover:scale-105 transition-transform text-lg py-6 font-semibold shadow-glow"
            >
              Start Game 🎯
              {names.length < 2 && (
                <span className="text-xs opacity-75 ml-2">
                  (Need at least 2 players)
                </span>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NameInputForm;