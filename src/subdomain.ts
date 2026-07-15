import crypto from 'crypto';

const ADJECTIVES = [
  'able', 'active', 'alert', 'apt', 'avid', 'bold', 'brave', 'bright', 'broad', 'calm',
  'clean', 'clear', 'cool', 'cozy', 'crazy', 'curious', 'daily', 'deep', 'eager', 'early',
  'easy', 'faint', 'fair', 'fancy', 'fast', 'fine', 'firm', 'flashy', 'fresh', 'full',
  'funny', 'gentle', 'giant', 'glad', 'good', 'grand', 'great', 'happy', 'hard', 'hazy',
  'heavy', 'high', 'hollow', 'huge', 'hungry', 'icy', 'jolly', 'jumpy', 'keen', 'kind',
  'large', 'late', 'lazy', 'light', 'little', 'lively', 'long', 'loud', 'low', 'lucky',
  'mellow', 'mighty', 'modern', 'neat', 'new', 'nice', 'nimble', 'noisy', 'odd', 'old',
  'pale', 'plain', 'polite', 'proud', 'quick', 'quiet', 'rare', 'rapid', 'ready', 'real',
  'rich', 'ripe', 'rough', 'round', 'safe', 'sharp', 'shiny', 'short', 'shy', 'silly',
  'sleek', 'slow', 'small', 'smart', 'smooth', 'soft', 'solid', 'speedy', 'spry', 'stale',
  'strong', 'sunny', 'swift', 'tall', 'tame', 'tart', 'tidy', 'tiny', 'tough', 'vast',
  'warm', 'weak', 'wet', 'wide', 'wild', 'wise', 'witty', 'young', 'zany', 'zesty',
];

const NOUNS = [
  'ant', 'ape', 'bear', 'bird', 'boar', 'cat', 'cobra', 'crab', 'crow', 'deer',
  'dog', 'dove', 'duck', 'eagle', 'eel', 'falcon', 'fish', 'fox', 'frog', 'goat',
  'goose', 'hawk', 'horse', 'koala', 'lion', 'lizard', 'llama', 'lynx', 'mole', 'moose',
  'mouse', 'newt', 'otter', 'owl', 'ox', 'panda', 'panther', 'parrot', 'pig', 'pony',
  'pug', 'rabbit', 'raccoon', 'rat', 'raven', 'seal', 'shark', 'sheep', 'snake', 'sparrow',
  'spider', 'squid', 'squirrel', 'swan', 'tiger', 'toad', 'trout', 'turtle', 'viper', 'wasp',
  'whale', 'wolf', 'worm', 'zebra', 'beacon', 'canyon', 'comet', 'crystal', 'delta', 'dune',
  'echo', 'frost', 'glacier', 'harbor', 'horizon', 'island', 'jungle', 'lagoon', 'meadow', 'mirage',
  'nebula', 'oasis', 'ocean', 'orbit', 'peak', 'prairie', 'quasar', 'reef', 'ridge', 'river',
  'shadow', 'summit', 'tundra', 'valley', 'volcano', 'wave', 'zenith',
];

// Crypto-strength alphanumeric token appended to every subdomain. Non-password
// artifacts are protected only by the secrecy of their URL, so the readable
// adjective-noun pair (a tiny, guessable namespace) can't be the sole guard —
// this token adds ~46 bits of unguessable entropy against enumeration.
const TOKEN_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const TOKEN_LENGTH = 9;

function randomToken(): string {
  const bytes = crypto.randomBytes(TOKEN_LENGTH);
  let out = '';
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    out += TOKEN_ALPHABET[bytes[i] % TOKEN_ALPHABET.length];
  }
  return out;
}

export function generateSubdomain(): string {
  const adj = ADJECTIVES[crypto.randomInt(ADJECTIVES.length)];
  const noun = NOUNS[crypto.randomInt(NOUNS.length)];
  return `${adj}-${noun}-${randomToken()}`;
}

export function generateId(): string {
  return crypto.randomUUID();
}
