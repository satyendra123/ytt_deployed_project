const { exec } = require('child_process');
exec('start http://localhost:3000');  // Opens browser
exec('npx serve -s build -l 3000');
