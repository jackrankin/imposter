import { useState } from "react";
import { Shuffle, Users, Eye, EyeOff, RotateCcw, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ImposterWordGame() {
  const [gameState, setGameState] = useState("setup");
  const [numPlayers, setNumPlayers] = useState("");
  const [secretWord, setSecretWord] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [imposterIndex, setImposterIndex] = useState(null);
  const [showWord, setShowWord] = useState(false);
  const [revealSetupWord, setRevealSetupWord] = useState(true);
  const [message, setMessage] = useState(null);

  const wordSuggestions = [
    "Pizza",
    "Beach",
    "Library",
    "Hospital",
    "School",
    "Mountain",
    "Airplane",
    "Coffee",
    "Guitar",
    "Telescope",
    "Iron Man",
    "Diet Coke",
    "Grass",
    "New York City",
    "Boyfriend",
    "Girlfriend",
  ];

  const startGame = () => {
    const players = parseInt(numPlayers);
    if (isNaN(players) || players < 3 || players > 67) {
      setMessage("Please enter a number of players between 3 and 67.");
      return;
    }
    if (!secretWord.trim()) {
      setMessage("Please enter a secret word.");
      return;
    }
    const randomImposter = Math.floor(Math.random() * players) + 1;
    setImposterIndex(randomImposter);
    setCurrentPlayer(1);
    setGameState("between");
    setMessage(null);
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
    setMessage(null);
  };

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * wordSuggestions.length);
    setSecretWord(wordSuggestions[randomIndex]);
    setRevealSetupWord(false);
  };

  const MessageModal = ({ message, onClose }) => {
    if (!message) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="bg-white rounded-xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-gray-800">Oops!</h3>
          <p className="text-gray-600">{message}</p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Got it
          </button>
        </motion.div>
      </div>
    );
  };

  const Button = ({ children, onClick, variant = "default" }) => {
    const base =
      "w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-transform active:scale-95";
    const variants = {
      default:
        "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg",
      subtle: "bg-gray-300 text-gray-800 hover:bg-gray-200",
      danger: "bg-red-500 text-white hover:bg-red-600",
      success: "bg-green-500 text-white hover:bg-green-600",
    };
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`${base} ${variants[variant]}`}
      >
        {children}
      </motion.button>
    );
  };

  const renderContent = () => {
    if (gameState === "setup") {
      return (
        <motion.div
          key="setup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="flex flex-col h-full justify-center p-6 space-y-8"
        >
          <div className="text-center space-y-2">
            {/* <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Users className="text-white" size={32} />
            </motion.div> */}
            <h1 className="text-4xl font-extrabold text-gray-900">
              find the imposter
            </h1>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                number of players
              </label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                min="3"
                max="67"
                value={numPlayers}
                onChange={(e) => setNumPlayers(e.target.value)}
                className="mt-1 w-full border-b-2 border-gray-300 bg-transparent py-2 text-center text-3xl font-bold focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="3-67"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                secret word
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={secretWord}
                  onChange={(e) => {
                    setSecretWord(e.target.value);
                    setRevealSetupWord(true);
                  }}
                  className={`flex-1 border-b-2 border-gray-300 bg-transparent py-2 text-center text-xl font-bold focus:border-purple-500 focus:outline-none transition-colors ${
                    !revealSetupWord && secretWord ? "blur-sm" : ""
                  }`}
                  placeholder="enter or click randomize"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={getRandomWord}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <Shuffle size={20} className="text-gray-600" />
                </motion.button>
              </div>
            </div>
          </div>
          <Button onClick={startGame}>Start Game</Button>
        </motion.div>
      );
    }

    if (gameState === "between") {
      return (
        <motion.div
          key="between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="flex flex-col h-full justify-center items-center text-center space-y-6 p-6"
        >
          <p className="text-gray-500 font-medium">Pass the phone to</p>
          <h2 className="text-5xl font-extrabold text-gray-900 mt-2">
            Player {currentPlayer}
          </h2>
          <Button onClick={seeWord}>
            <Eye size={20} /> Reveal Word
          </Button>
        </motion.div>
      );
    }

    if (gameState === "playing") {
      const isImposter = currentPlayer === imposterIndex;
      return (
        <motion.div
          key="playing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="flex flex-col h-full justify-center items-center text-center space-y-8 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-700">
            You are Player {currentPlayer}
          </h2>
          {isImposter ? (
            <div className="space-y-2">
              <EyeOff className="mx-auto text-red-600 mb-2" size={48} />
              <p className="text-red-700 font-extrabold text-3xl">
                You are the Imposter!
              </p>
              <p className="text-red-600 text-lg">
                Don’t get caught. Listen carefully.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-green-700 font-semibold text-lg">
                Secret Word:
              </p>
              <p className="text-4xl font-extrabold text-green-800">
                {secretWord}
              </p>
              <p className="text-green-600 text-lg">
                Try to blend in with your description.
              </p>
            </div>
          )}
          <Button onClick={nextPlayer}>
            {currentPlayer < parseInt(numPlayers) ? "Next Player" : "End Game"}
          </Button>
        </motion.div>
      );
    }

    if (gameState === "pending-finish") {
      return (
        <motion.div
          key="pending"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="flex flex-col h-full justify-center items-center text-center space-y-6 p-6"
        >
          <h2 className="text-3xl font-extrabold text-gray-900">
            Time to Discuss!
          </h2>
          <p className="text-lg text-gray-600">
            Everyone has seen their word. Try to find the imposter.
          </p>
          <Button variant="subtle" onClick={() => setGameState("complete")}>
            Reveal Results
          </Button>
        </motion.div>
      );
    }

    if (gameState === "complete") {
      return (
        <motion.div
          key="complete"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="flex flex-col h-full justify-center items-center text-center space-y-6 p-6"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Game Over
          </h2>
          <p className="text-gray-700 font-semibold text-lg">
            The secret word was{" "}
            <span className="text-indigo-800 font-bold">{secretWord}</span>
          </p>
          <p className="text-gray-700 font-semibold text-lg">
            The imposter was{" "}
            <span className="text-indigo-800 font-bold">
              Player {imposterIndex}
            </span>
          </p>
          <Button onClick={resetGame}>
            <RotateCcw size={18} /> Play Again
          </Button>
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 font-sans text-gray-800">
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      <MessageModal message={message} onClose={() => setMessage(null)} />
    </div>
  );
}
