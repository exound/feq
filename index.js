export default class Req {
  constructor({headers = {}, requestProcessors = [], responseProcessors = []} = {}) {
    this.options = {};
    this.options.headers = headers;
    this.options.mode = "cors";

    this.requestProcessors = requestProcessors;
    this.responseProcessors = responseProcessors;

    Object.freeze(this.options);
  }

  send({method, url, body, options} = {}) {
    var _options = {headers: this.options.headers, mode: this.options.mode, method: method};

    if (body) _options.body = body;

    if (options) {
      for (let key1 in options) {
        if (key1 === "headers") for (let key2 in options.headers) _options.headers[key2.toLowerCase()] = options.headers[key2];
        else _options[key1] = options[key1];
      }
    }

    this.requestProcessors.forEach((f) => {
      f.call(_options);
    });

    return fetch(new Request(url, _options)).then((response) => {
      return this.responseProcessors.reduce((response, postProcessors) => {
        return response.then(postProcessors);
      }, Promise.resolve(response));
    });
  }

  get(url, options) {
    return this.send({method: "GET", url, options});
  }

  delete(url, options) {
    return this.send({method: "DELETE", url, options});
  }

  post(url, body, options) {
    return this.send({method: "POST", url, body, options});
  }

  put(url, body, options) {
    return this.send({method: "PUT", url, body, options});
  }

  patch(url, body, options) {
    return this.send({method: "PATCH", url, body, options});
  }
}