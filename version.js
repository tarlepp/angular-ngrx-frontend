/**
 * This file purpose is just to write `src/assets/version.json` file that
 * contains current version information about this application. This file
 * is executed on `postinstall` process.
 *
 * This static file will be used later on to check if frontend application
 * has been updated during user has been used it without reloading page
 * itself.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const dir = './src/assets';
const filePath = path.join(dir, 'version.json');

// Create directory if it doesn't exist
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const data = {
  version: require('./package.json').version,
};

fs.writeFile(filePath, JSON.stringify(data, null, '  ') + '\n', (error) => {
  if (error) {
    throw error;
  }
});
