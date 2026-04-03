const fs = require('fs');
if (fs.existsSync('env.json')) {
  fs.copyFileSync('env.json', 'dist/env.json');
  console.log('env.json copied to dist/');
} else {
  console.log('env.json not found, skipping copy');
}
