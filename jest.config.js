module.exports = {
    setupFiles: ["<rootDir>/server/test/setup.js"],
    "transform": {
      "^.+\\.js?$": "babel-jest"
    },
    testRegex: 'test/.*\.test\.js$'
   };