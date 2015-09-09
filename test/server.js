import http from "http";

const server = http.createServer(function (req, res) {
  res.writeHead(200, {"Content-Type": "application/json"});
  res.end(JSON.stringify({are_we_bla_yet: false}));
});

function listen(...args) {
  server.listen.apply(server, args);
};

function close(callback) {
  server.close(callback);
};

export default {listen, close};
