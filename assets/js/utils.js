function parseCoordinate(value) {
  // Décimal simple
  if (!isNaN(value)) return parseFloat(value);

  // DMS: 36°48'12N
  const regex = /(\d+)[°](\d+)'(\d+)?([NSEW])/i;
  const match = value.replace(/\s/g, '').match(regex);

  if (!match) return NaN;

  let deg = parseFloat(match[1]);
  let min = parseFloat(match[2]);
  let sec = parseFloat(match[3] || 0);
  let dir = match[4].toUpperCase();

  let dec = deg + min / 60 + sec / 3600;
  if (dir === 'S' || dir === 'W') dec *= -1;

  return dec;
}
