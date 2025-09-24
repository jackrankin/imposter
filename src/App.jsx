import { useState } from "react";
import { Shuffle, Users, Eye, EyeOff, RotateCcw } from "lucide-react";

export default function ImposterWordGame() {
  const [gameState, setGameState] = useState("setup");
  const [numPlayers, setNumPlayers] = useState("");
  const [secretWord, setSecretWord] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [imposterIndex, setImposterIndex] = useState(null);
  const [showWord, setShowWord] = useState(false);
  const [revealSetupWord, setRevealSetupWord] = useState(true);

  const wordSuggestions = ["Pizza", "Beach", "Library", "Hospital", "School"];

  const startGame = () => {
    const players = parseInt(numPlayers);
    if (players < 3 || players > 12) {
      alert("Please enter 3–12 players");
      return;
    }
    if (!secretWord.trim()) {
      alert("Please enter a secret word");
      return;
    }
    const randomImposter = Math.floor(Math.random() * players) + 1;
    setImposterIndex(randomImposter);
    setCurrentPlayer(1);
    setGameState("between");
  };

  const seeWord = () => {
    setShowWord(true);
    setGameState("playing");
  };

  const nextPlayer = () => {
    const totalPlayers = parseInt(numPlayers);
    if (currentPlayer < totalPlayers) {
      setCurrentPlayer(currentPlayer + 1);
      setGameState("between");
      setShowWord(false);
    } else {
      setGameState("pending-finish");
    }
  };

  const resetGame = () => {
    setGameState("setup");
    setNumPlayers("");
    setSecretWord("");
    setCurrentPlayer(1);
    setImposterIndex(null);
    setShowWord(false);
    setRevealSetupWord(true);
  };

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * wordSuggestions.length);
    setSecretWord(wordSuggestions[randomIndex]);
    setRevealSetupWord(false);
  };

  const Screen = ({ children }) => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-pink-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center space-y-6 border border-gray-200">
        {children}
      </div>
    </div>
  );

  const Button = ({ children, onClick, variant = "default" }) => {
    const base =
      "w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors";
    const variants = {
      default:
        "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800",
      subtle: "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300",
      danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
      success: "bg-green-500 text-white hover:bg-green-600 active:bg-green-700",
    };
    return (
      <button onClick={onClick} className={`${base} ${variants[variant]}`}>
        {children}
      </button>
    );
  };

  if (gameState === "setup") {
    return (
      <Screen>
        <div className="flex flex-col items-center gap-3">
          <div className="bg-indigo-600 w-14 h-14 rounded-full flex items-center justify-center">
            <Users className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Imposter Word Game
          </h1>
          <p className="text-gray-600 text-sm">
            One player is the imposter 👀 The rest share the secret word.
          </p>
        </div>

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm mb-1">Number of Players</label>
            <input
              type="number"
              min="3"
              max="12"
              value={numPlayers}
              onChange={(e) => setNumPlayers(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="3–12"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Secret Word</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={secretWord}
                onChange={(e) => {
                  setSecretWord(e.target.value);
                  setRevealSetupWord(true);
                }}
                className={`flex-1 border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none ${
                  !revealSetupWord && secretWord ? "blur-sm" : ""
                }`}
                placeholder="Enter or randomize"
              />
              <button
                onClick={getRandomWord}
                className="border px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <Shuffle size={18} />
              </button>
            </div>
          </div>
        </div>

        <Button onClick={startGame}>Start Game</Button>
      </Screen>
    );
  }

  if (gameState === "between") {
    return (
      <Screen>
        <h2 className="text-xl font-semibold text-gray-800">
          Player {currentPlayer}
        </h2>
        <p className="text-gray-500 text-sm">Pass the phone 👋</p>
        <Button onClick={seeWord}>
          <Eye size={20} /> Reveal Word
        </Button>
      </Screen>
    );
  }

  if (gameState === "playing") {
    const isImposter = currentPlayer === imposterIndex;
    return (
      <Screen>
        <h2 className="text-xl font-semibold">Player {currentPlayer}</h2>
        {isImposter ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
            <EyeOff className="mx-auto text-red-600" size={28} />
            <p className="text-red-700 font-bold text-lg">
              You are the Imposter!
            </p>
            <p className="text-red-600 text-sm">Blend in… don’t get caught.</p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
            <Eye className="mx-auto text-green-600" size={28} />
            <p className="text-green-700 text-sm">Secret Word:</p>
            <p className="text-2xl font-bold text-green-800">{secretWord}</p>
          </div>
        )}
        <Button onClick={nextPlayer}>
          {currentPlayer < parseInt(numPlayers) ? "Next Player" : "Finish Game"}
        </Button>
      </Screen>
    );
  }

  if (gameState === "pending-finish") {
    return (
      <Screen>
        <h2 className="text-xl font-semibold">All Players Ready</h2>
        <p className="text-gray-500 text-sm">Time to reveal the results 🎉</p>
        <Button variant="subtle" onClick={() => setGameState("complete")}>
          Show Results
        </Button>
      </Screen>
    );
  }

  if (gameState === "complete") {
    return (
      <Screen>
        <h2 className="text-2xl font-bold text-gray-800">Game Complete</h2>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-2">
          <p className="text-gray-700">
            <strong>Word:</strong> {secretWord}
          </p>
          <p className="text-gray-700">
            <strong>Imposter:</strong> Player {imposterIndex}
          </p>
        </div>
        <Button onClick={resetGame}>
          <RotateCcw size={18} /> Play Again
        </Button>
      </Screen>
    );
  }
}
