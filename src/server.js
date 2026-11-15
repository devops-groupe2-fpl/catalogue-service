const app = require('./app');

const port = Number(process.env.PORT || 3000);

const server = app.listen(port, () => {
  console.log(`Catalogue service listening on port ${port}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down catalogue service`);
  server.close(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
