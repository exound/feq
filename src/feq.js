import fetch from "isomorphic-fetch";

export default class Feq {
  constructor({headers = {}, requestProcessors = [], responseProcessors = []} = {}) {
    this.options = {};
    this.options.headers = headers;
    this.options.mode = "cors";

    this.requestProcessors = requestProcessors;
    this.responseProcessors = responseProcessors;

    Object.freeze(this.options);
  }

  send({method, url, body, options} = {}) {
    const plainRequest = {method};
    const headers = {};

    if (body) plainRequest.body = body;

    Object.assign(plainRequest, this.options);
    Object.assign(headers, this.options.headers);

    if (options) {
      if (options.headers) Object.assign(headers, options.headers);
      Object.assign(plainResponse, options);
    }

    plainRequest.headers = headers;

    this.requestProcessors.forEach(processor => processor(plainRequest));

    return Feq.fetch(url, plainRequest)
      .then(response => {
        const plainResponse = {};

        [
          "ok", "url", "type", "status", "statusText"
        ].forEach(prop => plainResponse[prop] = response[prop]);

        plainResponse.headers = response.headers;

        const contentType = plainResponse.headers.get("Content-Type") || "";

        const bodyPromise = contentType.includes("/json") ?
              response.json() :
              (contentType.includes("text/") ? response.text() : response.blob());

        return Promise.all([plainResponse, bodyPromise]);
      })
      .then(array => {
        const plainResponse = array[0];
        const body = array[1];

        plainResponse.body = body;

        return plainResponse;
      })
      .then(response => {
        this.responseProcessors.forEach(processor => processor(response));
        return response;
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

Feq.fetch = fetch;
