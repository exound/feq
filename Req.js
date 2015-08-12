export default class Req {
  constructor({headers = {}, requestProcessors = [], responseProcessors = []} = {}) {
    this.options = {};
    this.options.headers = headers;
    this.options.mode = "cors";

    this.requestProcessors = requestProcessors;
    this.responseProcessors = responseProcessors;

    Object.freeze(this.options);
  }

  send({method, url, body} = {}) {
    var options = {headers: this.options.headers, mode: this.options.mode, method: method};

    if (body) options.body = body;

    this.requestProcessors.forEach((f) => {
      f.call(options);
    });

    return fetch(new Request(url, options)).then((response) => {
      return this.responseProcessors.reduce((response, postProcessors) => {
        return response.then(postProcessors);
      }, Promise.resolve(response));
    });
  }

  get(url) {
    return this.send({method: "GET", url});
  }

  delete(url) {
    return this.send({method: "DELETE", url});
  }

  post(url, body) {
    return this.send({method: "POST", url, body});
  }

  put(url, body) {
    return this.send({method: "PUT", url, body});
  }

  patch(url, body) {
    return this.send({method: "PATCH", url, body});
  }
}