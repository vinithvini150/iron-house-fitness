
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const dns = require('node:dns');

if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const app = require('../server');

const PORT = process.env.PORT || 5002;

function start() {
  app.listen(PORT, () => {
    console.log(`Iron House Fitness running at http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = app;
