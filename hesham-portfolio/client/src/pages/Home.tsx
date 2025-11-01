import { useEffect, useState, useRef, KeyboardEvent } from "react";

interface CommandOutput {
  command: string;
  output: string;
  timestamp: Date;
}

export default function Home() {
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show welcome message on load
    const welcomeMessage = `Welcome to Hesham's AI Terminal v2.0

Type 'help' to see available commands.
Type 'about' to learn more about me.
`;
    setHistory([{
      command: "",
      output: welcomeMessage,
      timestamp: new Date()
    }]);
    
    // Focus input on load
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new output is added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    // Add to command history
    if (trimmedCmd) {
      setCommandHistory(prev => [...prev, cmd]);
    }
    
    let output = "";

    switch (trimmedCmd) {
      case "":
        output = "";
        break;
        
      case "help":
        output = `Available commands:

  help          - Show this help message
  about         - About Hesham Haroon
  whoami        - Display current user information
  skills        - List technical skills and proficiency
  experience    - Show professional experience
  education     - Display education and certifications
  publications  - List research publications
  contact       - Show contact information
  projects      - Display notable projects
  
  clear         - Clear the terminal
  history       - Show command history
  ls            - List files
  pwd           - Print working directory
  date          - Display current date and time
  uname         - Show system information
  neofetch      - Display system info with style
  fortune       - Get a random fortune
  cowsay        - Hear from the cow
  ping          - Test connection
  top           - Show running processes
  ps            - List processes
  
Fun Commands (try them!):
  Try typing dangerous commands like 'rm -rf /' or 'hack' for surprises! 😈
  
Tip: Use Tab for auto-completion!
Tip: Use ↑/↓ arrows to navigate command history!`;
        break;

      case "about":
        output = `Hesham Haroon - AI Team Lead

I'm an AI engineer passionate about building impactful AI systems. Currently 
leading AI transformation at Egyptian Company For Cosmetics (ECC), where I 
develop AI tools that boost productivity and streamline operations.

With expertise in GenAI, Agentic LLMs, and NLP, I've spent years teaching 
machines to understand and generate human language. My work has improved 
business operations by 30% and enhanced NLP model performance by 25%.

When I'm not coding or mentoring aspiring AI engineers, you'll find me 
exploring the latest advancements in machine learning and contributing to 
the AI community.

Status: Caffeinated and ready to innovate ☕
Mission: Building AI solutions that make a difference`;
        break;

      case "whoami":
        output = `hesham-haroon

Name:     Hesham Haroon
Role:     AI Team Lead
Company:  Egyptian Company For Cosmetics - ECC
Location: Cairo, Egypt
Status:   Online and available for collaboration

Current Focus:
  • Leading AI transformation across all departments
  • Developing AI tools to boost employee productivity
  • Implementing GenAI and Agentic LLM solutions`;
        break;

      case "skills":
        output = `Technical Skills & Proficiency:

Core Competencies:
  • GenAI & Agentic LLMs        [████████████████████] 98%
  • Natural Language Processing [███████████████████ ] 95%
  • Python Development          [███████████████████ ] 95%
  • Machine Learning            [██████████████████  ] 92%
  • AWS Cloud Services          [█████████████████   ] 90%
  • Deep Learning               [████████████████    ] 88%
  • Text Analysis & Mining      [███████████████████ ] 95%
  • Language Translation        [████████████████    ] 85%

Frameworks & Tools:
  • PyTorch, TensorFlow, Transformers
  • LangChain, OpenAI API, Hugging Face
  • AWS, Azure, GCP
  • SQL, JavaScript, TypeScript

Languages:
  • Python (native)
  • SQL (fluent)
  • JavaScript (conversational)`;
        break;

      case "experience":
        output = `Professional Experience:

[2025-Present] AI Team Lead
  Egyptian Company For Cosmetics - ECC
  • Leading AI transformation across all departments
  • Developing AI tools to boost productivity by 40%
  • Collaborating with cross-functional teams

[Jan 2025 - Sep 2025] Senior AI Engineer
  Robusta Technology Group (Remote)
  • Enhanced NLP models and drove scalable AI solutions
  • Implemented cutting-edge AI architectures

[Jul 2024 - Jan 2025] Senior NLP Engineer
  WideBot, Cairo, Egypt
  • Enhanced NLP model performance by 25%
  • Implemented state-of-the-art language models

[Jul 2024 - Oct 2024] AI Mentor
  lablab.ai
  • Mentored 100+ aspiring AI engineers in hackathons
  • Guided participants in developing real-world AI applications

[Nov 2023 - Jul 2024] NLP Engineer
  OMOTO, Cairo, Egypt
  • Improved business operations by 30%
  • Integrated large language models into production

[Feb 2023 - Jul 2024] NLP Engineer
  LingoAI (Remote)
  • Advanced linguistic modeling capabilities
  • Conducted NLP research and experimentation

[Jun 2023 - Jan 2024] NLP Engineer
  ASAS AI
  • Conducted research on LLM fine-tuning
  • Implemented state-of-the-art NLP models

[Jun 2023 - Oct 2023] Machine Learning Fellow
  Fellowship.AI
  • Built scalable ML models with agile methodology
  • Applied latest research in deep learning and LLMs

[Apr 2023 - Sep 2023] NLP Engineer
  Iwan Research Group, Riyadh, Saudi Arabia
  • Evaluated Arabic translation models
  • Published research on PLM error analysis

[Jun 2021 - Aug 2022] Freelance ML/NLP Engineer
  Upwork
  • 20% increase in machine translation accuracy
  • 25% improvement in text mining efficiency
  • 30% reduction in model training time`;
        break;

      case "education":
        output = `Education & Certifications:

Academic Background:
  Bachelor's Degree in Linguistics
  Minia University

Specialized Training:
  • ACL (Association for Computational Linguistics)
    Mentorship & Research Program (2021-2022)
  
  • Hertie School
    Diploma (2021-2022)

Professional Certifications:
  ✓ Amazon Web Services (AWS)
  ✓ IBM SmartCloud Control Desk V7.5
  ✓ Intermediate SQL
  ✓ Introduction to Programming Using Python`;
        break;

      case "publications":
        output = `Research Publications:

[1] "Error Analysis of Pretrained Language Models (PLMs) in 
    English-to-Arabic Machine Translation"
    Published during tenure at Iwan Research Group
    
[2] "Leveraging Corpus Metadata to Detect Template-based Translation:
    An Exploratory Case Study of the Egyptian Arabic Wikipedia Edition"

Research Focus Areas:
  • Arabic NLP and Machine Translation
  • Large Language Model Fine-tuning
  • Cross-lingual Transfer Learning
  • Error Analysis in Neural MT Systems`;
        break;

      case "contact":
        output = `Contact Information:

Email:    heshamharoon19@gmail.com
Phone:    01144223563
LinkedIn: linkedin.com/in/hesham-haroon
GitHub:   github.com/h9-tec
Location: Cairo, Egypt

Status:   Available for collaboration and interesting challenges
Response: Usually within 24 hours

Feel free to reach out for:
  • AI consulting and solutions
  • Research collaboration
  • Speaking engagements
  • Mentorship opportunities`;
        break;

      case "projects":
        output = `Notable Projects & Achievements:

AI Transformation Initiative (ECC)
  Leading company-wide AI adoption, developing tools that boost
  productivity across all departments.

NLP Model Enhancement (WideBot)
  Improved model performance by 25% through advanced fine-tuning
  and optimization techniques.

Business Process Optimization (OMOTO)
  Implemented LLM-based solutions that improved operations by 30%.

AI Hackathon Mentorship (lablab.ai)
  Mentored 100+ participants, helping them build innovative AI
  applications across various industries.

Freelance ML/NLP Projects (Upwork)
  • +20% machine translation accuracy
  • +25% text mining efficiency
  • -30% model training time
  • +10% overall model accuracy`;
        break;

      case "clear":
        setHistory([]);
        setCurrentCommand("");
        return;

      case "history":
        output = commandHistory.length > 0
          ? commandHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`).join("\n")
          : "No commands in history yet.";
        break;

      case "ls":
        output = `about.txt  contact.txt  education.txt  experience.txt  projects.txt  publications.txt  skills.txt`;
        break;

      case "pwd":
        output = `/home/hesham`;
        break;

      case "date":
        output = new Date().toString();
        break;

      case "uname":
      case "uname -a":
        output = `Linux hesham-ai 5.15.0-42-generic #45-Ubuntu SMP x86_64 GNU/Linux`;
        break;

      case "neofetch":
        output = `                          hesham@ubuntu
                          -------------
                          OS: Ubuntu 22.04 LTS x86_64
                          Host: AI Engineering Workstation
                          Kernel: 5.15.0-42-generic
                          Uptime: 4 years, 5 months
                          Shell: bash 5.1.16
                          Resolution: 1920x1080
                          DE: GNOME 42.5
                          Theme: Yaru-dark
                          CPU: AI Core Processor (16) @ 4.20GHz
                          GPU: BRAIN-CORE-A100
                          Memory: 80123MiB / 81920MiB`;
        break;

      case "fortune":
        const fortunes = [
          "You will build something amazing today.",
          "A bug is just a feature you haven't documented yet.",
          "Coffee + Code = Success",
          "The best way to predict the future is to build it.",
          "In AI we trust, but we still verify the outputs.",
          "Today's impossible is tomorrow's AI model."
        ];
        output = fortunes[Math.floor(Math.random() * fortunes.length)];
        break;

      case "cowsay":
        output = ` _____________________________________
< I'm an AI engineer, not a magician >
< ...but sometimes it's hard to tell >
 --------------------------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
        break;

      case "sudo":
      case "sudo su":
        output = `[sudo] password for hesham: 
Sorry, you don't have permission to become root.
But you can still explore my portfolio! 😊`;
        break;

      case "exit":
      case "logout":
        output = `Thanks for visiting! But you can't actually leave... 😈
Just kidding! Feel free to keep exploring or close the tab.`;
        break;

      case "rm -rf":
      case "rm -rf /":
      case "rm -rf /*":
      case "sudo rm -rf /":
      case "sudo rm -rf /*":
        output = `⚠️  WARNING: Deleting system files...

[████████████████████████████████████████] 100%

Just kidding! 😂 Did you really think I'd let you delete my portfolio?
Nice try though. You can't break this terminal that easily!

Pro tip: Never run 'rm -rf /' on a real system. Trust me on this one.`;
        break;

      case "hack":
      case "hacking":
      case "exploit":
      case "hack system":
      case "hack the system":
        output = `🔐 INITIATING HACKING SEQUENCE...

[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%

Access Denied! 🚫

LOL, what did you expect? This isn't a Hollywood movie! 🎬
But I appreciate your curiosity. Maybe try 'skills' to see my
real hacking skills (aka legitimate AI engineering). 😎`;
        break;

      case "sudo hack":
        output = `[sudo] password for hesham: 

Nice try, but even with sudo, you can't hack this terminal! 😏
I'm an AI engineer, not a movie hacker. Try 'help' instead.`;
        break;

      case "cd":
      case "cd ~":
        output = ``;
        break;

      case "cd ..":
        output = `bash: cd: ..: Permission denied
You're already at the root of my portfolio!`;
        break;

      case "mkdir":
        output = `mkdir: missing operand
Try 'mkdir <directory_name>'... but it won't actually work here. 😉`;
        break;

      case "touch":
        output = `touch: missing file operand
This is a read-only portfolio, but nice try!`;
        break;

      case "vim":
      case "vi":
        output = `Starting vim...

Just kidding! No vim here. This isn't a code editor.
Besides, everyone knows the only way to exit vim is to restart your computer. 😂`;
        break;

      case "nano":
        output = `GNU nano 6.2

Error: This is a portfolio, not a text editor!
But at least you know how to exit nano (unlike vim users). 😏`;
        break;

      case "cat":
        output = `cat: missing file operand
Try 'cat <filename>' or just use the portfolio commands like 'about' or 'skills'.`;
        break;

      case "top":
      case "htop":
        output = `top - 23:59:59 up 4 years, 5 months, 42 users, load average: 0.42, 0.69, 1.33
Tasks: 420 total, 1 running, 419 sleeping

PID  USER      PR  NI    VIRT    RES  %CPU %MEM     TIME+ COMMAND
1337 hesham    20   0   1024M   512M  95.0 64.0  1234:56 brain.exe
2048 hesham    20   0    512M   256M  50.0 32.0   567:89 ai_models
4096 hesham    20   0    256M   128M  25.0 16.0   234:56 coffee_maker

Press 'q' to quit... oh wait, this isn't real top! 😄`;
        break;

      case "ps":
      case "ps aux":
        output = `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
hesham    1337 95.0 64.0 1048576 524288 ?     Sl   Jan01 1234:56 /usr/bin/brain
hesham    2048 50.0 32.0  524288 262144 ?     Sl   Jan01  567:89 /usr/bin/ai_models
hesham    4096 25.0 16.0  262144 131072 ?     Sl   Jan01  234:56 /usr/bin/coffee_maker`;
        break;

      case "kill":
        output = `kill: missing operand
You can't kill my processes! They're immortal. 😈`;
        break;

      case "reboot":
      case "shutdown":
        output = `shutdown: Need to be root

Did you really think you could shut down my portfolio? 😂
Nice try! It's staying online 24/7.`;
        break;

      case "apt install":
      case "apt-get install":
      case "yum install":
        output = `E: Package not specified
Besides, this portfolio comes fully loaded! No installation needed. 📦`;
        break;



      case "echo":
        output = `echo: missing operand
Usage: echo <text>
But honestly, just type 'help' to see what you can really do here!`;
        break;

      case "man":
        output = `What manual page do you want?
For example, try 'help' to see available commands in this portfolio.`;
        break;

      case "ssh":
        output = `ssh: connect to host portfolio.hesham.ai port 22: Connection refused
You're already here! No need for SSH. 😊`;
        break;

      case "ping":
        output = `PING hesham-portfolio (192.168.1.42) 56(84) bytes of data.
64 bytes from hesham-portfolio (192.168.1.42): icmp_seq=1 ttl=64 time=0.042 ms
64 bytes from hesham-portfolio (192.168.1.42): icmp_seq=2 ttl=64 time=0.037 ms
64 bytes from hesham-portfolio (192.168.1.42): icmp_seq=3 ttl=64 time=0.041 ms

--- hesham-portfolio ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2042ms
rtt min/avg/max/mdev = 0.037/0.040/0.042/0.002 ms`;
        break;

      case "wget":
      case "curl":
        output = `${trimmedCmd}: missing URL
What do you want to download? My resume? Just type 'experience'! 😄`;
        break;

      default:
        output = `Command not found: ${trimmedCmd}

Type 'help' to see available commands.`;
        break;
    }

    setHistory(prev => [...prev, {
      command: cmd,
      output,
      timestamp: new Date()
    }]);
    
    setCurrentCommand("");
    setHistoryIndex(-1);
  };

  const handleTabCompletion = () => {
    const availableCommands = [
      "help", "about", "whoami", "skills", "experience", 
      "education", "publications", "contact", "projects", 
      "clear", "history", "ls", "pwd", "date", "uname",
      "neofetch", "fortune", "cowsay", "ping", "top", "ps"
    ];
    
    const matches = availableCommands.filter(cmd => 
      cmd.startsWith(currentCommand.toLowerCase())
    );
    
    if (matches.length === 1) {
      setCurrentCommand(matches[0]);
    } else if (matches.length > 1) {
      const output = matches.join("  ");
      setHistory(prev => [...prev, {
        command: currentCommand,
        output,
        timestamp: new Date()
      }]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      handleTabCompletion();
    } else if (e.key === "Enter") {
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

  return (
    <div 
      className="min-h-screen bg-[#300a24] text-[#ffffff] font-mono p-4"
      onClick={() => inputRef.current?.focus()}
    >
      <div 
        ref={terminalRef}
        className="max-w-5xl mx-auto"
      >
        {/* Terminal Output */}
        <div className="mb-4">
          {history.map((item, index) => (
            <div key={index} className="mb-2">
              {item.command && (
                <div className="flex items-start gap-2">
                  <span className="text-green-400">hesham@ubuntu:~$</span>
                  <span className="text-white">{item.command}</span>
                </div>
              )}
              {item.output && (
                <pre className="text-gray-300 whitespace-pre-wrap mt-1 ml-0">
{item.output}
                </pre>
              )}
            </div>
          ))}
        </div>

        {/* Command Input */}
        <div className="flex items-start gap-2">
          <span className="text-green-400">hesham@ubuntu:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
