import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Zap, Plus, Dice6, ArrowRight } from 'lucide-react';
import { categories } from '../data/defaultQuestions';

const TruthOrDareModal = ({ 
  isOpen, 
  onClose, 
  player1, 
  player2, 
  customQuestions, 
  setCustomQuestions 
}) => {
  const [gameMode, setGameMode] = useState(null); // 'truth' or 'dare'
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionType, setQuestionType] = useState('truth');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setGameMode(null);
      setCurrentQuestion('');
      setShowAddQuestion(false);
      setNewQuestion('');
    }
  }, [isOpen]);

  const selectMode = (mode) => {
    setGameMode(mode);
    generateQuestion(mode);
  };

  const generateQuestion = (mode) => {
    const allQuestions = [
      ...categories[mode],
      ...(customQuestions[mode] || [])
    ];
    
    if (allQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * allQuestions.length);
      setCurrentQuestion(allQuestions[randomIndex]);
    } else {
      setCurrentQuestion(`No ${mode} questions available. Add some custom ones!`);
    }
  };

  const addCustomQuestion = () => {
    if (newQuestion.trim()) {
      const updated = {
        ...customQuestions,
        [questionType]: [...(customQuestions[questionType] || []), newQuestion.trim()]
      };
      setCustomQuestions(updated);
      localStorage.setItem('truthSpinCustomQuestions', JSON.stringify(updated));
      setNewQuestion('');
      setShowAddQuestion(false);
    }
  };

  const nextRound = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-card border-0 shadow-vibrant">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Truth or Dare? 🎯
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Players */}
          <Card className="bg-muted/50 border-primary/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-4 text-lg font-semibold">
                <Badge variant="secondary" className="px-4 py-2 text-primary">
                  {player1}
                </Badge>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <Badge variant="secondary" className="px-4 py-2 text-accent">
                  {player2}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {player1} asks • {player2} answers
              </p>
            </CardContent>
          </Card>

          {!gameMode ? (
            /* Mode Selection */
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => selectMode('truth')}
                className="h-24 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 hover:scale-105 transition-transform"
              >
                <div className="flex flex-col items-center">
                  <Heart className="h-8 w-8 mb-2" />
                  <span className="text-lg font-bold">Truth</span>
                </div>
              </Button>
              
              <Button
                onClick={() => selectMode('dare')}
                className="h-24 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 hover:scale-105 transition-transform"
              >
                <div className="flex flex-col items-center">
                  <Zap className="h-8 w-8 mb-2" />
                  <span className="text-lg font-bold">Dare</span>
                </div>
              </Button>
            </div>
          ) : (
            /* Question Display */
            <div className="space-y-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <Badge 
                    className={`mb-4 text-lg px-4 py-2 ${
                      gameMode === 'truth' 
                        ? 'bg-blue-500 hover:bg-blue-600' 
                        : 'bg-orange-500 hover:bg-orange-600'
                    } text-white border-0`}
                  >
                    {gameMode.toUpperCase()}
                  </Badge>
                  <p className="text-lg font-medium leading-relaxed">
                    {currentQuestion}
                  </p>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  onClick={() => generateQuestion(gameMode)}
                  variant="outline"
                  className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Dice6 className="h-4 w-4 mr-2" />
                  New Question
                </Button>
                
                <Button
                  onClick={() => setShowAddQuestion(true)}
                  variant="outline"
                  className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Add Custom Question */}
          {showAddQuestion && (
            <Card className="bg-muted/30 border-accent/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-2">
                  <Button
                    onClick={() => setQuestionType('truth')}
                    variant={questionType === 'truth' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                  >
                    Truth
                  </Button>
                  <Button
                    onClick={() => setQuestionType('dare')}
                    variant={questionType === 'dare' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                  >
                    Dare
                  </Button>
                </div>
                
                <Textarea
                  placeholder={`Enter a custom ${questionType} question...`}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  rows={2}
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={addCustomQuestion}
                    disabled={!newQuestion.trim()}
                    size="sm"
                    className="bg-gradient-primary"
                  >
                    Add Question
                  </Button>
                  <Button
                    onClick={() => setShowAddQuestion(false)}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Round Button */}
          {gameMode && (
            <Button
              onClick={nextRound}
              className="w-full bg-gradient-primary hover:scale-105 transition-transform text-lg py-6 font-semibold shadow-glow"
            >
              Next Round 🎯
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TruthOrDareModal;