import { useEffect, useState } from "react";

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);

  const bootMessages = [
    "[ OK ] Initializing Hesham's AI Terminal System...",
    "[ OK ] Loading Neural Network Modules...",
    "[ OK ] Mounting /dev/brain0 - AI Core Processor",
    "[ OK ] Starting GenAI Service...",
    "[ OK ] Loading NLP Models (BERT, GPT, Transformers)...",
    "[ OK ] Initializing Python Runtime Environment",
    "[ OK ] Connecting to GitHub Repository...",
    "[ OK ] Loading Portfolio Data...",
    "[ OK ] Starting Express.js Backend Server",
    "[ OK ] Mounting React Frontend Application",
    "[ OK ] Establishing WebSocket Connections...",
    "[ OK ] Loading Machine Learning Pipelines...",
    "[ OK ] Initializing Authentication Modules",
    "[ OK ] Starting AI Assistant Services...",
    "[ OK ] Calibrating Hacker Mode... 🚀",
    "",
    "System Boot Complete!",
    "Welcome to Hesham's Interactive Terminal Portfolio",
    "",
  ];

  useEffect(() => {
    if (currentLine < bootMessages.length) {
      const timer = setTimeout(() => {
        setLines((prev) => [...prev, bootMessages[currentLine]]);
        setCurrentLine((prev) => prev + 1);
      }, 80);

      return () => clearTimeout(timer);
    } else {
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(completeTimer);
    }
  }, [currentLine, bootMessages, onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="w-full max-w-4xl p-8 font-mono text-[#00ff00] text-sm">
        <div className="mb-8 text-center">
          <div className="text-2xl font-bold mb-2 animate-pulse">
            ╔═══════════════════════════════════════════╗
          </div>
          <div className="text-xl font-bold">
            HESHAM AI TERMINAL - BOOT SEQUENCE
          </div>
          <div className="text-2xl font-bold mt-2 animate-pulse">
            ╚═══════════════════════════════════════════╝
          </div>
        </div>
        
        <div className="space-y-1">
          {lines.map((line, index) => (
            <div
              key={index}
              className="animate-fadeIn"
              style={{ 
                animationDelay: `${index * 0.05}s`,
                textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
              }}
            >
              {line}
            </div>
          ))}
          {currentLine < bootMessages.length && (
            <div className="inline-block animate-pulse">█</div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex gap-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-[#00ff00] rounded-sm"
                style={{
                  opacity: i < (currentLine / bootMessages.length) * 20 ? 1 : 0.2,
                  transition: "opacity 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

