// Step 1: Import the necessary package
const NodeMediaServer = require('node-media-server');

// Step 2: Configure the RTMP server
const config = {
  rtmp: {
    port: process.env.RTMP_PORT || 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: process.env.PORT || 8000,
    allow_origin: '*'
  }
};

// Step 3: Create and start the RTMP server
const nms = new NodeMediaServer(config);
nms.run();

// Step 4 (Optional): Handle server events
nms.on('prePublish', (id, StreamPath, args) => {
  console.log(nms.getSession(id) + " is streaming to " + StreamPath);
});