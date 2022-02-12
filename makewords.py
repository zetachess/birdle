# ptyhon3 makewords.py > src/constants/wordlist.ts

import random

cset = ['🐦', '🐓', '🦤', '🦃', '🦚', '🦜', '🦅', '🐧', '🦉', '🥚']

# TODO remove dupes
print('export const WORDS = [')
for i in range(100):
    word = ''.join([random.choice(cset) for i in range(5)])
    print(f"  '{word}',")
print(']')
