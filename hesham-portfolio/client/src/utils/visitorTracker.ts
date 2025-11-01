/**
 * Visitor tracking utility
 * Tracks unique visitors using localStorage and session data
 */

interface VisitorData {
  totalVisits: number;
  uniqueVisitors: Set<string>;
  lastVisit: string;
  currentSession: string;
}

const STORAGE_KEY = "portfolio_visitors";
const SESSION_KEY = "portfolio_session";

/**
 * Generate a simple unique visitor ID
 */
function generateVisitorId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `visitor_${timestamp}_${random}`;
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = generateVisitorId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * Get visitor data from localStorage
 */
function getVisitorData(): VisitorData {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        totalVisits: parsed.totalVisits || 0,
        uniqueVisitors: new Set(parsed.uniqueVisitors || []),
        lastVisit: parsed.lastVisit || new Date().toISOString(),
        currentSession: parsed.currentSession || "",
      };
    } catch (e) {
      console.error("Error parsing visitor data:", e);
    }
  }
  
  return {
    totalVisits: 0,
    uniqueVisitors: new Set(),
    lastVisit: new Date().toISOString(),
    currentSession: "",
  };
}

/**
 * Save visitor data to localStorage
 */
function saveVisitorData(data: VisitorData): void {
  try {
    const toStore = {
      totalVisits: data.totalVisits,
      uniqueVisitors: Array.from(data.uniqueVisitors),
      lastVisit: data.lastVisit,
      currentSession: data.currentSession,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch (e) {
    console.error("Error saving visitor data:", e);
  }
}

/**
 * Track visitor and return statistics
 */
export function trackVisitor(): {
  totalVisits: number;
  uniqueVisitors: number;
  isNewVisitor: boolean;
  isNewSession: boolean;
} {
  const sessionId = getSessionId();
  const data = getVisitorData();
  
  const isNewSession = data.currentSession !== sessionId;
  const isNewVisitor = !data.uniqueVisitors.has(sessionId);
  
  // Update data
  if (isNewSession) {
    data.totalVisits += 1;
    data.currentSession = sessionId;
  }
  
  if (isNewVisitor) {
    data.uniqueVisitors.add(sessionId);
  }
  
  data.lastVisit = new Date().toISOString();
  
  // Save updated data
  saveVisitorData(data);
  
  return {
    totalVisits: data.totalVisits,
    uniqueVisitors: data.uniqueVisitors.size,
    isNewVisitor,
    isNewSession,
  };
}

/**
 * Get current visitor statistics without incrementing
 */
export function getVisitorStats(): {
  totalVisits: number;
  uniqueVisitors: number;
  lastVisit: string;
} {
  const data = getVisitorData();
  
  return {
    totalVisits: data.totalVisits,
    uniqueVisitors: data.uniqueVisitors.size,
    lastVisit: data.lastVisit,
  };
}

/**
 * Reset visitor tracking (for testing/debugging)
 */
export function resetVisitorTracking(): void {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

