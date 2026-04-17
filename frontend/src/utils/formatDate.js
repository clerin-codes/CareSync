export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(dateStr, time) {
  const date = formatDate(dateStr);
  return `${date} at ${time}`;
}
