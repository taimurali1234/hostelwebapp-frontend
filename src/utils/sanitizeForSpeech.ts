export const sanitizeForSpeech = (text: string): string => {
  return (
    text
      // Remove markdown syntax
      .replace(/[#*_~`>]/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "") // images
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → text only

      // Remove bullets & symbols
      .replace(/[-•–—]/g, "")
      .replace(/[🛏💰📅⭐👋❓🙂]/g, "")

      // Remove extra punctuation noise
      .replace(/[:]/g, "")

      // Normalize spacing
      .replace(/\n+/g, ". ")
      .replace(/\s+/g, " ")
      .trim()
  );
};
