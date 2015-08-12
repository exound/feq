"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Req = (function () {
  function Req() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$headers = _ref.headers;
    var headers = _ref$headers === undefined ? {} : _ref$headers;
    var _ref$requestProcessors = _ref.requestProcessors;
    var requestProcessors = _ref$requestProcessors === undefined ? [] : _ref$requestProcessors;
    var _ref$responseProcessors = _ref.responseProcessors;
    var responseProcessors = _ref$responseProcessors === undefined ? [] : _ref$responseProcessors;

    _classCallCheck(this, Req);

    this.options = {};
    this.options.headers = headers;
    this.options.mode = "cors";

    this.requestProcessors = requestProcessors;
    this.responseProcessors = responseProcessors;

    Object.freeze(this.options);
  }

  _createClass(Req, [{
    key: "send",
    value: function send() {
      var _this = this;

      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var method = _ref2.method;
      var url = _ref2.url;
      var body = _ref2.body;

      var options = { headers: this.options.headers, mode: this.options.mode, method: method };

      if (body) options.body = body;

      this.requestProcessors.forEach(function (f) {
        f.call(options);
      });

      return fetch(new Request(url, options)).then(function (response) {
        return _this.responseProcessors.reduce(function (response, postProcessors) {
          return response.then(postProcessors);
        }, Promise.resolve(response));
      });
    }
  }, {
    key: "get",
    value: function get(url) {
      return this.send({ method: "GET", url: url });
    }
  }, {
    key: "delete",
    value: function _delete(url) {
      return this.send({ method: "DELETE", url: url });
    }
  }, {
    key: "post",
    value: function post(url, body) {
      return this.send({ method: "POST", url: url, body: body });
    }
  }, {
    key: "put",
    value: function put(url, body) {
      return this.send({ method: "PUT", url: url, body: body });
    }
  }, {
    key: "patch",
    value: function patch(url, body) {
      return this.send({ method: "PATCH", url: url, body: body });
    }
  }]);

  return Req;
})();

exports["default"] = Req;
module.exports = exports["default"];

//# sourceMappingURL=Req-compiled.js.map