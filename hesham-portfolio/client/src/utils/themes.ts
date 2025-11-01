export interface Theme {
  name: string;
  background: string;
  text: string;
  prompt: string;
  command: string;
  border: string;
  glow: string;
  shadow: string;
}

export const themes: Record<string, Theme> = {
  deathnote: {
    name: "Death Note",
    background: "#0d1117",
    text: "#7ee787",
    prompt: "#58a6ff",
    command: "#79c0ff",
    border: "#58a6ff",
    glow: "rgba(88, 166, 255, 0.5)",
    shadow: "0 0 20px rgba(88, 166, 255, 0.3)",
  },
  matrix: {
    name: "Matrix",
    background: "#0a0e0a",
    text: "#00ff41",
    prompt: "#00ff41",
    command: "#39ff14",
    border: "#00ff41",
    glow: "rgba(0, 255, 65, 0.6)",
    shadow: "0 0 25px rgba(0, 255, 65, 0.4)",
  },
  hacker: {
    name: "Hacker",
    background: "#0a0a0a",
    text: "#ff0000",
    prompt: "#ff0066",
    command: "#ff6600",
    border: "#ff0000",
    glow: "rgba(255, 0, 0, 0.5)",
    shadow: "0 0 20px rgba(255, 0, 0, 0.3)",
  },
  cyberpunk: {
    name: "Cyberpunk",
    background: "#0d0221",
    text: "#ff00ff",
    prompt: "#00ffff",
    command: "#ffff00",
    border: "#ff00ff",
    glow: "rgba(255, 0, 255, 0.5)",
    shadow: "0 0 20px rgba(255, 0, 255, 0.3)",
  },
  retro: {
    name: "Retro Amber",
    background: "#000000",
    text: "#ffb000",
    prompt: "#ffb000",
    command: "#ffd700",
    border: "#ffb000",
    glow: "rgba(255, 176, 0, 0.5)",
    shadow: "0 0 20px rgba(255, 176, 0, 0.3)",
  },
  ubuntu: {
    name: "Ubuntu",
    background: "#300a24",
    text: "#ffffff",
    prompt: "#8ae234",
    command: "#729fcf",
    border: "#8ae234",
    glow: "rgba(138, 226, 52, 0.5)",
    shadow: "0 0 20px rgba(138, 226, 52, 0.3)",
  },
};

export const getTheme = (themeName: string): Theme => {
  return themes[themeName] || themes.deathnote;
};

