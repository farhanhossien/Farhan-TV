import { Channel } from "../types";

// Determine if a channel belongs to Bangladesh (priority 1)
export function isBangladeshChannel(channel: Channel): boolean {
  const g = channel.group.toLowerCase();
  const n = channel.name.toLowerCase();
  return (
    g === "bangla" ||
    g === "bangladesh" ||
    n.includes("bd") ||
    n.includes("rtv") ||
    n.includes("ntv") ||
    n.includes("btv") ||
    n.includes("atn") ||
    n.includes("somoy") ||
    n.includes("jamuna") ||
    n.includes("ekattor") ||
    n.includes("dbc") ||
    n.includes("ekhon") ||
    n.includes("deepto") ||
    n.includes("nagorik") ||
    n.includes("anirban") ||
    n.includes("ash tv") ||
    n.includes("deshi tv") ||
    n.includes("desh tv") ||
    n.includes("ekushey") ||
    n.includes("mohona") ||
    n.includes("movie bangla") ||
    n.includes("my tv") ||
    n.includes("rajdhani") ||
    n.includes("jago news") ||
    n.includes("g-series") ||
    n.includes("duronto") ||
    n.includes("ananda") ||
    n.includes("bangla tv") ||
    n.includes("boishakhi")
  );
}

// Determine if a channel belongs to India (priority 2)
export function isIndiaChannel(channel: Channel): boolean {
  if (isBangladeshChannel(channel)) return false;
  
  const g = channel.group.toLowerCase();
  const n = channel.name.toLowerCase();
  return (
    g === "india" ||
    g === "indian bg" ||
    g === "hindi" ||
    g === "punjabi" ||
    n.includes("kolkata") ||
    n.includes("jalsha") ||
    n.includes("zee 24") ||
    n.includes("republic bangla") ||
    n.includes("rongeen") ||
    n.includes("sheemaroo") ||
    n.includes("star plus") ||
    n.includes("sony tv") ||
    n.includes("star sports") ||
    n.includes("sony sports") ||
    n.includes("sony max") ||
    n.includes("star gold") ||
    n.includes("star movies") ||
    n.includes("zee tv") ||
    n.includes("dangal") ||
    n.includes("9x jalwa") ||
    n.includes("9x tashan") ||
    n.includes("dhinchaak") ||
    n.includes("manoranjan") ||
    n.includes("taaza tv") ||
    n.includes("assam talks") ||
    n.includes("goldmines") ||
    n.includes("abp ananda")
  );
}

// Determine if a channel is Bangla/Bengali (from either Bangladesh or West Bengal/India)
export function isBanglaChannel(channel: Channel): boolean {
  if (isBangladeshChannel(channel)) return true;
  
  const g = channel.group.toLowerCase();
  const n = channel.name.toLowerCase();
  
  return (
    g.includes("bangla") ||
    g.includes("bengali") ||
    g.includes("kolkata") ||
    n.includes("bangla") ||
    n.includes("bengali") ||
    n.includes("kolkata") ||
    n.includes("jalsha") ||
    n.includes("zee 24") ||
    n.includes("zee ২৪") ||
    n.includes("abp ananda") ||
    n.includes("republic bangla") ||
    n.includes("r plus") ||
    n.includes("ghanta") ||
    n.includes("aath") ||
    n.includes("boishakhi") ||
    n.includes("akash") ||
    n.includes("rupashi")
  );
}

// Sort channels with Bangladesh on top, then India, then others
export function sortChannelsByPriority(channels: Channel[]): Channel[] {
  return [...channels].sort((a, b) => {
    const isABd = isBangladeshChannel(a);
    const isBBd = isBangladeshChannel(b);
    if (isABd && !isBBd) return -1;
    if (!isABd && isBBd) return 1;

    const isAInd = isIndiaChannel(a);
    const isBInd = isIndiaChannel(b);
    if (isAInd && !isBInd) return -1;
    if (!isAInd && isBInd) return 1;

    return a.name.localeCompare(b.name);
  });
}

// Map the raw categories/groups list to nice visual names
export const CATEGORY_FILTERS = [
  { id: "fifa-2026", label: "FIFA 2026", isFifa: true },
  { id: "all", label: "ALL" },
  { id: "bangla", label: "BANGLA" },
  { id: "english", label: "ENGLISH" },
  { id: "hindi", label: "HINDI" },
  { id: "islamic", label: "ISLAMIC" },
  { id: "kids", label: "KIDS" },
  { id: "sports", label: "SPORTS" }
];

export function filterChannels(channels: Channel[], categoryId: string, search: string): Channel[] {
  let filtered = channels;

  // Search Filter first
  if (search.trim()) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      c => c.name.toLowerCase().includes(query) || c.group.toLowerCase().includes(query)
    );
  }

  // Category Filter
  if (categoryId === "all") {
    return sortChannelsByPriority(filtered);
  } else if (categoryId === "bangla") {
    return filtered.filter(c => isBangladeshChannel(c) || isBanglaChannel(c) || c.group.toLowerCase() === "bangladesh" || c.group.toLowerCase().includes("bangla") || c.group.toLowerCase().includes("bengali"));
  } else if (categoryId === "english") {
    return filtered.filter(c => {
      if (isBanglaChannel(c)) return false;
      const g = c.group.toLowerCase();
      const n = c.name.toLowerCase();
      return g.includes("english") || g.includes("news") || n.includes("news") || g.includes("movie") || g.includes("entertainment");
    });
  } else if (categoryId === "hindi") {
    return filtered.filter(c => {
      if (isBanglaChannel(c)) return false;
      const g = c.group.toLowerCase();
      const n = c.name.toLowerCase();
      return (isIndiaChannel(c) || g.includes("hindi") || g.includes("india"));
    });
  } else if (categoryId === "islamic") {
    return filtered.filter(c => {
      const g = c.group.toLowerCase();
      const n = c.name.toLowerCase();
      return g.includes("islamic") || n.includes("islam") || n.includes("quran") || n.includes("makkah") || n.includes("madinah") || n.includes("peace tv");
    });
  } else if (categoryId === "kids") {
    return filtered.filter(c => {
      const g = c.group.toLowerCase();
      const n = c.name.toLowerCase();
      return g.includes("kids") || n.includes("disney") || n.includes("cartoon") || n.includes("nickelodeon");
    });
  } else if (categoryId === "sports") {
    return filtered.filter(c => {
      const g = c.group.toLowerCase();
      const n = c.name.toLowerCase();
      return g.includes("sport") || n.includes("sport") || g.includes("ipl") || g.includes("cricket");
    });
  } else if (categoryId === "fifa-2026") {
    return filtered.filter(c => {
      const g = c.group.toLowerCase();
      const n = c.name.toLowerCase();
      return n.includes("fifa") || n.includes("world cup") || g.includes("fifa") || n.includes("sport") || g.includes("sport");
    });
  }

  return filtered;
}
