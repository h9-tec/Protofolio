import { useEffect, useState, useRef, KeyboardEvent, useCallback } from "react";
import BootSequence from "@/components/BootSequence";
import MatrixRain from "@/components/MatrixRain";
import SnakeGame from "@/components/SnakeGame";
import { getTheme, Theme, themes } from "@/utils/themes";
import { achievements, unlockAchievement } from "@/utils/achievements";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";
import { getCommandOutput } from "@/utils/commandOutputs";
import { trackVisitor, getVisitorStats } from "@/utils/visitorTracker";

interface CommandOutput {
  command: string;
  output: string | JSX.Element;
  timestamp: Date;
}

export default function HomeEnhanced() {
  // State management
  const [showBoot, setShowBoot] = useState(true);
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [theme, setTheme] = useState<Theme>(getTheme("deathnote"));
  const [matrixEnabled, setMatrixEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [commandCount, setCommandCount] = useState(0);
  const [uniqueCommands, setUniqueCommands] = useState<Set<string>>(new Set());
  const [showSnake, setShowSnake] = useState(false);
  const [konami, setKonami] = useState<string[]>([]);
  const [visitorStats, setVisitorStats] = useState({ totalVisits: 0, uniqueVisitors: 0, isNewVisitor: false });

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { playKeyPress, playCommandSuccess, playCommandError } = useAudioFeedback();

  // Konami code: ↑ ↑ ↓ ↓ ← → ← → b a
  const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

  useEffect(() => {
    const handleKonami = (e: KeyboardEvent) => {
      const newKonami = [...konami, e.key].slice(-10);
      setKonami(newKonami);

      if (JSON.stringify(newKonami) === JSON.stringify(konamiCode)) {
        const achievement = unlockAchievement("konami-master", unlockedAchievements, setUnlockedAchievements);
        if (achievement) {
          setHistory((prev) => [
            ...prev,
            {
              command: "",
              output: `🎖️ KONAMI CODE ACTIVATED! Achievement Unlocked: ${achievement.title}`,
              timestamp: new Date(),
            },
          ]);
        }
        setKonami([]);
      }
    };

    window.addEventListener("keydown", handleKonami as any);
    return () => window.removeEventListener("keydown", handleKonami as any);
  }, [konami, unlockedAchievements]);

  // Track visitor on mount
  useEffect(() => {
    const stats = trackVisitor();
    setVisitorStats(stats);
    
    // Show welcome message for new visitors
    if (stats.isNewVisitor) {
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          {
            command: "",
            output: `🎉 Welcome, new visitor! You are visitor #${stats.uniqueVisitors}!`,
            timestamp: new Date(),
          },
        ]);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (showBoot) return;

    const welcomeMessage = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   Welcome to Hesham's AI Terminal v3.0 - LEGENDARY EDITION   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

Type 'help' to see all available commands.
Type 'demo' to see an automated demonstration.
Type 'achievements' to track your progress.

Total Visits: ${visitorStats.totalVisits} | Unique Visitors: ${visitorStats.uniqueVisitors} | Theme: ${theme.name} | Audio: ${audioEnabled ? "ON" : "OFF"}
`;

    setHistory([
      {
        command: "",
        output: welcomeMessage,
        timestamp: new Date(),
      },
    ]);

    inputRef.current?.focus();
  }, [showBoot, theme.name, audioEnabled, visitorStats]);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 0);
  }, [history]);

  const unlockAchievementWithNotification = useCallback(
    (achievementId: string) => {
      const achievement = unlockAchievement(achievementId, unlockedAchievements, setUnlockedAchievements);
      if (achievement) {
        setHistory((prev) => [
          ...prev,
          {
            command: "",
            output: `🏆 Achievement Unlocked: ${achievement.icon} ${achievement.title} - ${achievement.description}`,
            timestamp: new Date(),
          },
        ]);
      }
    },
    [unlockedAchievements]
  );

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    if (trimmedCmd) {
      setCommandHistory((prev) => [...prev, cmd]);
      setCommandCount((prev) => prev + 1);
      
      const newUniqueCommands = new Set(uniqueCommands);
      newUniqueCommands.add(trimmedCmd);
      setUniqueCommands(newUniqueCommands);

      // Unlock achievements
      if (commandCount === 0) {
        unlockAchievementWithNotification("first-command");
      }
      if (newUniqueCommands.size >= 5) {
        unlockAchievementWithNotification("explorer");
      }
      if (commandCount >= 19) {
        unlockAchievementWithNotification("command-master");
      }

      if (audioEnabled) {
        playCommandSuccess();
      }
    }

    let output: string | JSX.Element = "";

    switch (trimmedCmd) {
      case "":
        output = "";
        break;

      case "help":
        output = `
╔═══════════════════════════════════════════════════════════╗
║                    AVAILABLE COMMANDS                     ║
╚═══════════════════════════════════════════════════════════╝

📋 PORTFOLIO COMMANDS:
  help           - Show this help message
  about          - About Hesham Haroon
  whoami         - Display current user information
  skills         - List technical skills
  experience     - Show professional experience
  education      - Display education
  publications   - Research publications
  contact        - Contact information
  projects       - Notable projects
  resume         - Download resume (PDF/JSON)
  social         - Social media links with ASCII art

🎮 FUN & GAMES:
  snake          - Play Snake game
  matrix         - Toggle Matrix rain effect
  hack-simulator - Fake hacking sequence
  coffee         - Get a coffee ☕
  secret         - Find hidden content

🎨 CUSTOMIZATION:
  theme <name>   - Change theme (matrix/hacker/cyberpunk/retro/ubuntu)
  sound <on/off> - Toggle sound effects
  themes         - List all available themes

📊 STATS & INFO:
  stats          - Show terminal statistics
  achievements   - View unlocked achievements
  history        - Command history
  neofetch       - System information

🛠️ SYSTEM COMMANDS:
  clear          - Clear terminal
  ls             - List files
  pwd            - Print working directory
  date           - Show current date/time
  ping           - Test connection

💡 TIPS:
  • Use Tab for autocomplete
  • Use ↑/↓ for command history
  • Try the Konami code for a surprise!
  • Type dangerous commands for easter eggs 😈
`;
        break;

      case "about":
        output = `
╔═══════════════════════════════════════════════════════════╗
║              HESHAM HAROON - AI TEAM LEAD                 ║
╚═══════════════════════════════════════════════════════════╝

I'm an AI engineer passionate about building impactful AI systems. 
Currently leading AI transformation at Egyptian Company For Cosmetics 
(ECC), where I develop AI tools that boost productivity and streamline 
operations.

With expertise in GenAI, Agentic LLMs, and NLP, I've spent years 
teaching machines to understand and generate human language. My work 
has improved business operations by 30% and enhanced NLP model 
performance by 25%.

When I'm not coding or mentoring aspiring AI engineers, you'll find me 
exploring the latest advancements in machine learning and contributing 
to the AI community.

Status: ☕ Caffeinated and ready to innovate
Mission: Building AI solutions that make a difference
`;
        break;

      case "skills":
        output = getCommandOutput("skills");
        break;

      case "experience":
        output = getCommandOutput("experience");
        break;

      case "education":
        output = getCommandOutput("education");
        break;

      case "publications":
        output = getCommandOutput("publications");
        break;

      case "contact":
        output = getCommandOutput("contact");
        break;

      case "projects":
        output = getCommandOutput("projects");
        break;

      case "whoami":
        output = getCommandOutput("whoami");
        break;

      case "ls":
        output = getCommandOutput("ls");
        break;

      case "pwd":
        output = getCommandOutput("pwd");
        break;

      case "date":
        output = getCommandOutput("date");
        break;

      case "uname":
      case "uname -a":
        output = getCommandOutput("uname");
        break;

      case "neofetch":
        output = getCommandOutput("neofetch");
        break;

      case "ping":
        output = getCommandOutput("ping");
        break;

      case "fortune":
        output = getCommandOutput("fortune");
        break;

      case "cowsay":
        output = getCommandOutput("cowsay");
        break;

      case "history":
        output = commandHistory.length > 0
          ? commandHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`).join("\n")
          : "No commands in history yet.";
        break;

      case "themes":
        output = `
Available Themes:
${Object.keys(themes)
  .map((key) => `  • ${key.padEnd(15)} - ${themes[key].name}`)
  .join("\n")}

Usage: theme <name>
Example: theme cyberpunk
`;
        break;

      case "achievements":
        const unlockedCount = unlockedAchievements.size;
        const totalCount = achievements.length;
        const progress = Math.floor((unlockedCount / totalCount) * 100);

        output = `
╔═══════════════════════════════════════════════════════════╗
║                   ACHIEVEMENTS                            ║
║              ${unlockedCount}/${totalCount} Unlocked (${progress}%)                           ║
╚═══════════════════════════════════════════════════════════╝

${achievements
  .map((achievement) => {
    const unlocked = unlockedAchievements.has(achievement.id);
    return `${unlocked ? achievement.icon : "🔒"} ${achievement.title.padEnd(25)} ${unlocked ? "✓" : ""}
   ${achievement.description}`;
  })
  .join("\n\n")}
`;
        break;

      case "stats":
        output = `
╔═══════════════════════════════════════════════════════════╗
║                  TERMINAL STATISTICS                      ║
╚═══════════════════════════════════════════════════════════╝

Commands Executed:        ${commandCount}
Unique Commands:          ${uniqueCommands.size}
Achievements Unlocked:    ${unlockedAchievements.size}/${achievements.length}
Current Theme:            ${theme.name}
Matrix Effect:            ${matrixEnabled ? "ENABLED" : "DISABLED"}
Sound Effects:            ${audioEnabled ? "ENABLED" : "DISABLED"}
Total Visits:             ${visitorStats.totalVisits}
Unique Visitors:          ${visitorStats.uniqueVisitors}
Session Start:            ${history[0]?.timestamp.toLocaleTimeString()}
`;
        break;

      case "snake":
        unlockAchievementWithNotification("gamer");
        setShowSnake(true);
        output = "";
        break;

      case "matrix":
        setMatrixEnabled(!matrixEnabled);
        output = `Matrix rain effect ${!matrixEnabled ? "ENABLED" : "DISABLED"} 🌧️`;
        break;

      case "social":
        unlockAchievementWithNotification("social-butterfly");
        output = `
╔═══════════════════════════════════════════════════════════╗
║                   SOCIAL LINKS                            ║
╚═══════════════════════════════════════════════════════════╝

  ╭─────────────────────────────────────────╮
  │  💼  LinkedIn                           │
  │  linkedin.com/in/hesham-haroon          │
  ╰─────────────────────────────────────────╯

  ╭─────────────────────────────────────────╮
  │  🐙  GitHub                              │
  │  github.com/h9-tec                       │
  ╰─────────────────────────────────────────╯

  ╭─────────────────────────────────────────╮
  │  📧  Email                               │
  │  heshamharoon19@gmail.com                │
  ╰─────────────────────────────────────────╯

  ╭─────────────────────────────────────────╮
  │  📱  Phone                               │
  │  01144223563                             │
  ╰─────────────────────────────────────────╯
`;
        break;

      case "coffee":
        unlockAchievementWithNotification("easter-egg-hunter");
        output = `
    ( (
     ) )
  ........
  |      |]
  \\      /
   \`----'

☕ Here's your coffee! Remember: Code + Coffee = Success

Random Dev Joke:
Why do programmers prefer dark mode?
Because light attracts bugs! 🐛
`;
        break;

      case "secret":
        unlockAchievementWithNotification("easter-egg-hunter");
        output = `
🤫 SHHH! You found a secret!

Hidden achievement unlocked! You're one of the few who explored 
deep enough to find this. Keep exploring - there are more secrets 
hidden in this terminal...

Hint: Try the Konami code or type some "dangerous" commands 😈
`;
        break;

      case "resume":
      case "cv":
        output = `
Downloading resume...
[████████████████████████████████████████] 100%

✓ Resume downloaded successfully!

Available formats:
  • PDF:  /downloads/hesham-haroon-resume.pdf
  • JSON: /downloads/resume.json

Pro tip: Type 'resume --json' to view JSON format in terminal
`;
        // Trigger actual download
        window.open("/resume.json", "_blank");
        break;

      case "hack":
      case "hacking":
      case "exploit":
        unlockAchievementWithNotification("hacker-mode");
        output = `
🔐 INITIALIZING HACKING SEQUENCE...

[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%

Accessing mainframe...
Bypassing firewall...
Decrypting passwords...
Downloading confidential data...

Access GRANTED! 🚫

LOL, what did you expect? This isn't Mr. Robot! 😂
But I appreciate your curiosity. Achievement unlocked!

Try 'skills' to see my real hacking skills (aka legitimate AI engineering) 😎
`;
        break;

      case "hack-simulator":
        unlockAchievementWithNotification("gamer");
        output = `
INITIALIZING HACK SIMULATOR...

> Scanning network... 192.168.1.1
> Found 42 open ports
> Injecting payload...
> Bypassing authentication...
> Access granted to mainframe
> Downloading /etc/shadow...
> Cracking passwords...
> root:x:$6$LEGENDARY$PORTFOLIO

H4CK1NG C0MPL3T3! 💀

Achievement unlocked: H4CK3R M0D3
`;
        break;

      case "clear":
        setHistory([]);
        setCurrentCommand("");
        return;

      case "sound on":
        setAudioEnabled(true);
        playCommandSuccess();
        output = "🔊 Sound effects ENABLED";
        break;

      case "sound off":
        setAudioEnabled(false);
        output = "🔇 Sound effects DISABLED";
        break;

      default:
        if (trimmedCmd.startsWith("theme ")) {
          const themeName = trimmedCmd.split(" ")[1];
          if (themes[themeName]) {
            setTheme(getTheme(themeName));
            unlockAchievementWithNotification("theme-explorer");
            output = `Theme changed to: ${themes[themeName].name} ✨`;
          } else {
            output = `Theme '${themeName}' not found. Type 'themes' to see available themes.`;
          }
        } else {
          if (audioEnabled) {
            playCommandError();
          }
          output = `Command not found: ${trimmedCmd}\n\nType 'help' to see available commands.`;
        }
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        command: cmd,
        output,
        timestamp: new Date(),
      },
    ]);

    setCurrentCommand("");
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (audioEnabled && e.key.length === 1) {
      playKeyPress();
    }

    if (e.key === "Enter") {
      executeCommand(currentCommand);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand("");
      }
    }
  };

  if (showBoot) {
    return <BootSequence onComplete={() => setShowBoot(false)} />;
  }

  return (
    <div
      className="min-h-screen font-mono p-4 relative overflow-hidden"
      onClick={() => inputRef.current?.focus()}
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        fontFamily: '"Courier New", Courier, monospace',
        textShadow: `0 0 5px ${theme.glow}`,
      }}
    >
      <MatrixRain enabled={matrixEnabled} />

      {/* Enhanced L (Death Note) background */}
      <div
        className="fixed inset-0 bg-cover bg-right-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ 
          backgroundImage: "url(/assets/nerdy-bg.jpg)",
          filter: "contrast(1.2) brightness(0.9)",
        }}
      />
      {/* Spotlight effect on L */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 800px 1000px at 75% 50%, transparent 0%, ${theme.background}dd 60%, ${theme.background} 100%)`,
        }}
      />
      {/* Subtle vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, ${theme.background}88 100%)`,
        }}
      />

      {/* Subtle scanline effect for CRT feel */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-5"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 2px)",
        }}
      />
      
      {/* Subtle grid pattern for nerd aesthetic */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(${theme.border}22 1px, transparent 1px), linear-gradient(90deg, ${theme.border}22 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Terminal window */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Terminal Header */}
        <div
          className="border-2 rounded-t-lg px-4 py-3 flex items-center gap-3 backdrop-blur-md"
          style={{
            borderColor: theme.border,
            background: `linear-gradient(135deg, #1a1a1aee, #2a2a2aee)`,
            boxShadow: `0 0 15px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
          }}
        >
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-red-700 shadow-lg shadow-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-700 shadow-lg shadow-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 border border-green-700 shadow-lg shadow-green-500/50"></div>
          </div>
          <div className="flex-1 text-center text-sm font-bold tracking-widest" style={{ color: theme.prompt, textShadow: `0 0 10px ${theme.glow}` }}>
            ⚡ HESHAM@AI-TERMINAL - /home/hesham - {theme.name.toUpperCase()} MODE ⚡
          </div>
          <div className="text-xs font-mono px-2 py-1 rounded" style={{ 
            color: theme.command,
            background: 'rgba(0,0,0,0.3)',
            border: `1px solid ${theme.border}44`,
          }}>
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={terminalRef}
          className="border-2 border-t-0 rounded-b-lg p-8 backdrop-blur-md"
          style={{
            borderColor: theme.border,
            backgroundColor: `${theme.background}f5`,
            boxShadow: `${theme.shadow}, inset 0 0 100px rgba(0,0,0,0.3)`,
            minHeight: '70vh',
          }}
        >
          {/* Terminal Output */}
          <div className="mb-4">
            {history.map((item, index) => (
              <div key={index} className="mb-2">
                {item.command && (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="font-bold animate-pulse" style={{ color: theme.prompt }}>
                        ┌─[hesham@ai-terminal]─[~]
                      </span>
                    </div>
                    <div className="flex items-start gap-2 mb-1">
                      <span className="font-bold" style={{ color: theme.prompt }}>
                        └─$
                      </span>
                      <span style={{ color: theme.command }}>{item.command}</span>
                    </div>
                  </>
                )}
                {item.output && (
                  <pre className="whitespace-pre-wrap mt-1 ml-0 leading-relaxed opacity-90" style={{ color: theme.text }}>
                    {item.output}
                  </pre>
                )}
              </div>
            ))}
          </div>

          {/* Snake Game */}
          {showSnake && (
            <SnakeGame
              onExit={() => setShowSnake(false)}
              onScore={(score) => {
                if (score >= 100) {
                  unlockAchievementWithNotification("gamer");
                }
              }}
            />
          )}

          {/* Command Input */}
          <div>
            <div className="flex items-start gap-2">
              <span className="font-bold animate-pulse" style={{ color: theme.prompt }}>
                ┌─[hesham@ai-terminal]─[~]
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold" style={{ color: theme.prompt }}>
                └─$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none"
                style={{
                  color: theme.command,
                  caretColor: theme.prompt,
                  textShadow: `0 0 5px ${theme.glow}`,
                }}
                autoFocus
                spellCheck={false}
              />
              <span className="animate-pulse" style={{ color: theme.prompt }}>
                █
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

