const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 4;
const SUFFIX_LENGTH = 2;

function randomChar(): string {
  const index = Math.floor(Math.random() * ALPHABET.length);
  return ALPHABET[index];
}

function randomSegment(length: number): string {
  let segment = "";
  for (let i = 0; i < length; i++) {
    segment += randomChar();
  }
  return segment;
}

export function generateOujCode(): string {
  const part1 = randomSegment(CODE_LENGTH);
  const part2 = randomSegment(SUFFIX_LENGTH);
  return `OUJ-${part1}-${part2}`;
}
