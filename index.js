// Step 1: Import the necessary package
const NodeMediaServer = require('node-media-server');

// Step 2: Configure the RTMP server
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: './media'
  },
  trans: {
    ffmpeg: '/usr/local/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  }
};

// Step 3: Create and start the RTMP server
const nms = new NodeMediaServer(config);
nms.run();

// Step 4 (Optional): Handle server events
nms.on('prePublish', (id, StreamPath, args) => {
  console.log(nms.getSession(id) + " is streaming to " + StreamPath);
});