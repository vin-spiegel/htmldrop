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

export function generateSubdomain(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10; // 10-99
  return `${adj}-${noun}-${num}`;
}

export function generateId(): string {
  return crypto.randomUUID();
}
