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

const data = {
  version: require('./package.json').version,
};

fs.writeFile('./src/assets/version.json', JSON.stringify(data, null, '  ') + '\n', (error) => {
  if (error) {
    throw error;
  }
});
