const bold = (value?: string | null) => (value ? `**${value}**` : "");

const italics = (value?: string | null) => (value ? `_${value}_` : "");

export const markdownUtils = {
  bold,
  italics,
};
