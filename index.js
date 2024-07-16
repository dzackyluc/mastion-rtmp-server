// Step 1: Import the necessary package
const NodeMediaServer = require('node-media-server');
const fs = require('fs');
const path = require('path');

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
    allow_origin: '*',
    mediaroot: './media',
    webroot: './www',
    api: true,
    host: '0.0.0.0'
  },
  trans: {
    ffmpeg: process.env.FFMPEG_PATH || '/usr/local/bin/ffmpeg',
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

// Step 5: Delete all files in mediaroot and webroot when server is done
nms.on('donePublish', () => {
  const mediarootPath = path.join(__dirname, config.http.mediaroot);
  const webrootPath = path.join(__dirname, config.http.webroot);

  fs.readdir(mediarootPath, (err, files) => {
    if (err) {
      console.error('Error reading mediaroot directory:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(mediarootPath, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('Deleted file:', filePath);
        }
      });
    });
  });

  fs.readdir(webrootPath, (err, files) => {
    if (err) {
      console.error('Error reading webroot directory:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(webrootPath, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('Deleted file:', filePath);
        }
      });
    });
  });
});