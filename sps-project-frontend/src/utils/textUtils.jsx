export const highlightText = (text, searchTerm) => {
  const safeText = text || ""; // Ensure text is not null
  if (!searchTerm) return safeText;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = safeText.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <span key={index} style={{ backgroundColor: "yellow" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};
