import random

cset = ['🐦', '🐓', '🦤', '🦃', '🦚', '🦜', '🦅', '🐧', '🦉']

# TODO remove dupes
for i in range(100):
    word = ''.join([random.choice(cset) for i in range(5)])
    print(f"  '{word}',")
