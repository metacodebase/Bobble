#!/usr/bin/env node
/**
 * Builds splash-native.png from background/one.png with bobble-main.png centered.
 * Re-run after updating either source asset.
 */
const { spawnSync } = require('child_process');
const path = require('path');

const script = `
from PIL import Image

root = '${path.join(__dirname, '../src/assets/images')}'
bg = Image.open(f'{root}/background/one.png').convert('RGBA')
bob = Image.open(f'{root}/bobble-main.png').convert('RGBA')

mascot_width = round(bg.width * (400 / 393))
scale = mascot_width / bob.width
mascot_height = round(bob.height * scale)
bob_resized = bob.resize((mascot_width, mascot_height), Image.Resampling.LANCZOS)

composite = bg.copy()
x = (bg.width - mascot_width) // 2
y = (bg.height - mascot_height) // 2
composite.alpha_composite(bob_resized, (x, y))
composite.save(f'{root}/splash-native.png', optimize=True)
print('Wrote splash-native.png')
`;

const result = spawnSync('python3', ['-c', script], { stdio: 'inherit' });
process.exit(result.status ?? 1);
