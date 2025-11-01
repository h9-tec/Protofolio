export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const achievements: Achievement[] = [
  {
    id: "first-command",
    title: "First Steps",
    description: "Executed your first command",
    icon: "🎯",
    unlocked: false,
  },
  {
    id: "explorer",
    title: "Curious Explorer",
    description: "Tried 5 different commands",
    icon: "🔍",
    unlocked: false,
  },
  {
    id: "command-master",
    title: "Command Master",
    description: "Executed 20 commands",
    icon: "⚡",
    unlocked: false,
  },
  {
    id: "easter-egg-hunter",
    title: "Easter Egg Hunter",
    description: "Found a secret command",
    icon: "🥚",
    unlocked: false,
  },
  {
    id: "theme-explorer",
    title: "Theme Explorer",
    description: "Changed the terminal theme",
    icon: "🎨",
    unlocked: false,
  },
  {
    id: "gamer",
    title: "Retro Gamer",
    description: "Played a mini-game",
    icon: "🎮",
    unlocked: false,
  },
  {
    id: "social-butterfly",
    title: "Social Butterfly",
    description: "Checked out social links",
    icon: "🦋",
    unlocked: false,
  },
  {
    id: "konami-master",
    title: "Konami Master",
    description: "Entered the legendary code",
    icon: "🎖️",
    unlocked: false,
  },
  {
    id: "hacker-mode",
    title: "H4CK3R M0D3",
    description: "Tried to hack the system",
    icon: "💀",
    unlocked: false,
  },
  {
    id: "completionist",
    title: "Completionist",
    description: "Unlocked all achievements",
    icon: "🏆",
    unlocked: false,
  },
];

export function checkAchievement(
  achievementId: string,
  unlockedAchievements: Set<string>
): boolean {
  return unlockedAchievements.has(achievementId);
}

export function unlockAchievement(
  achievementId: string,
  unlockedAchievements: Set<string>,
  setUnlockedAchievements: (achievements: Set<string>) => void
): Achievement | null {
  if (!unlockedAchievements.has(achievementId)) {
    const newUnlocked = new Set(unlockedAchievements);
    newUnlocked.add(achievementId);
    setUnlockedAchievements(newUnlocked);
    
    const achievement = achievements.find((a) => a.id === achievementId);
    return achievement || null;
  }
  return null;
}

