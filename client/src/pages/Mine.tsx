import { useState, useRef, useEffect } from "react";
import useGameStore from "../components/Store/useGameStore";
import { motion, AnimatePresence } from "framer-motion";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/react";


interface FloatingText {
  id: number;
  text: string;
  x: number;
}

const Mine = () => {
  const { getToken } = useAuth();
  const setUserData = useGameStore((state) => state.setUserData);

  const [pendingClicks, setPendingClicks] = useState(0);
  const pendingClicksRef = useRef(0);
  const [isAutoMining, setIsAutoMining] = useState(false);
  
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);


  const spawnFloatingText = () => {
    const newText = {
      id: Date.now() + Math.random(),
      text: "+1 🪨",
      x: Math.random() * 60 - 30, // Between -30 and +30 pixels for horizontal spread
    };

    setFloatingTexts((prev) => [...prev, newText]);

    // Clear from DOM after 1 second
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== newText.id));
    }, 1000);
  };

  // Auto-Mining Interval
  useEffect(() => {
    if (isAutoMining) {
      const autoMineInterval = setInterval(() => {
        setPendingClicks((prev) => {
          const next = prev + 1;
          pendingClicksRef.current = next;
          return next;
        });
        spawnFloatingText(); // Auto-mining animation triggers
      }, 500);

      return () => clearInterval(autoMineInterval);
    }
  }, [isAutoMining]);

  // Main Backend Sync Interval
  useEffect(() => {
    const clickInterval = setInterval(async () => {
      if (pendingClicksRef.current > 0) {
        try {
          const clicksToSend = pendingClicksRef.current;
          if (clicksToSend === 0) return;

          const token = await getToken();
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/players/mine`,
            { clicks: clicksToSend },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setUserData(response.data.user);

          pendingClicksRef.current -= clicksToSend;
          setPendingClicks((prev) => prev - clicksToSend);
        } catch (error) {
          const axiosError = error as AxiosError<{ message: string }>;
          console.error(
            "Error:",
            axiosError.response?.data?.message || axiosError.message,
          );
        }
      }
    }, 2000);

    return () => {
      clearInterval(clickInterval);
    };
  }, [getToken, setUserData]);

  const handleMineClick = () => {
    setPendingClicks((prev) => {
      const next = prev + 1;
      pendingClicksRef.current = next;
      return next;
    });
    spawnFloatingText();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex flex-col items-center justify-center h-full p-8 relative overflow-hidden"
    >
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neutral-800 rounded-full blur-[100px] opacity-20 pointer-events-none" />

      <h1 className="text-3xl font-bold text-neutral-100 mb-2 select-none">
        Surface Mine
      </h1>
      <p className="text-neutral-500 mb-12 select-none">
        Click the rock to gather resources.
      </p>

      {/* THE CLICKER BUTTON & FLOATING TEXT CONTAINER */}
      <div className="relative">
        {/* Floating Texts (AnimatePresence with fade out) */}
        <AnimatePresence>
          {floatingTexts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 1, y: 0, x: item.x }}
              animate={{ opacity: 0, y: -100, x: item.x }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl font-black text-green-400 z-50 pointer-events-none select-none drop-shadow-md"
            >
              {item.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Stone Button */}
        <motion.button
          onClick={handleMineClick}
          whileTap={{ scale: 0.95 }}
          animate={
            isAutoMining ? { y: [0, -5, 0, 5, 0], x: [0, 2, -2, 0] } : {}
          }
          transition={isAutoMining ? { repeat: Infinity, duration: 0.2 } : {}}
          className="relative group transition-all duration-100"
        >
          <div className="absolute inset-0 bg-neutral-700 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
          <div
            className={`relative w-48 h-48 bg-neutral-800 border-4 rounded-full flex items-center justify-center shadow-2xl overflow-hidden cursor-pointer transition-colors ${
              isAutoMining
                ? "border-orange-500"
                : "border-neutral-700 hover:border-neutral-500"
            }`}
          >
            <span className="text-6xl select-none transform group-hover:scale-110 transition-transform">
              🪨
            </span>
          </div>
        </motion.button>
      </div>

      <div className="mt-16 flex flex-wrap justify-center gap-4">
        {/* THE AUTO-MINER TOGGLE */}
        <button
          onClick={() => setIsAutoMining(!isAutoMining)}
          className={`px-5 py-2.5 border rounded-lg text-sm font-black tracking-wide select-none transition-all duration-300 flex items-center gap-3 active:scale-95 ${
            isAutoMining
              ? "bg-orange-600/10 border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(234,88,12,0.2)]"
              : "bg-neutral-900 border-neutral-800 text-neutral-600 hover:text-neutral-400 hover:border-neutral-700"
          }`}
        >
          <span className="relative flex h-3 w-3">
            {isAutoMining && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-3 w-3 transition-colors ${
                isAutoMining
                  ? "bg-orange-500 shadow-[0_0_8px_rgba(234,88,12,1)]"
                  : "bg-neutral-700"
              }`}
            ></span>
          </span>
          {isAutoMining ? "AUTO-MINER: ACTIVE" : "AUTO-MINER: OFF"}
        </button>

        {/* SERVER SYNC STATUS */}
        <div
          className={`px-5 py-2.5 border rounded-lg text-sm font-bold tracking-wide select-none flex items-center gap-2 transition-colors duration-500 ${
            pendingClicks > 0
              ? "bg-orange-900/20 border-orange-500/50 text-orange-400"
              : "bg-green-900/10 border-green-500/30 text-green-500"
          }`}
        >
          {pendingClicks > 0 ? (
            <>
              {/* Loading Spinner */}
              <svg
                className="animate-spin h-4 w-4 text-orange-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Syncing {pendingClicks} clicks...</span>
            </>
          ) : (
            <>
              {/* Saved Point */}
              <span className="relative flex h-3 w-3 mr-1">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              </span>
              <span>Saved to Cloud</span>
            </>
          )}
        </div>

        <div className="px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-600 text-sm font-bold select-none cursor-not-allowed">
          Deep Caves WIP 🔒
        </div>
      </div>
    </motion.div>
  );
};

export default Mine;
