// npm run makewords > src/constants/wordlist.ts

import { flatKeys } from './src/constants/keys'

// https://stackoverflow.com/a/2450976
function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
    array[randomIndex], array[currentIndex]];
  }

  return array;
}

console.log('export const WORDS = [');

Array.from(Array(100)).forEach(_ => {
  const birds = Array.from(Array(5)).map(i => shuffle(flatKeys)[0]).join('');
  console.log(`    '${birds}',`);
});

console.log(']');
