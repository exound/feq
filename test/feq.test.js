import Feq, {fetch} from "../src/feq";
import server from "./server";
import {expect} from "chai";

const cache = {};
const port = 4193;

function clear() {
  delete cache.request;
  delete cache.response;
}

const feq = new Feq({
  headers: {
    "X-Bla": "bla"
  },

  requestProcessors: [
    function(request) {
      request.headers["X-Bla1"] = "bla1";
    },
    function(request) {
      cache.request = request;

      request.headers["X-Bla2"] = "bla2";
    }
  ],

  responseProcessors: [
    function(response) {
      response.bla1 = 1;
    },
    function(response) {
      response.bla2 = 2;
    }
  ]
});


describe("Feq", () => {
  before(() => {
    server.listen(port);
  });

  after(() => {
    server.close();
  });

  afterEach(() => {
    clear();
  });

  describe("#send()", () =>  {
    it ("returns promised response", () => {
      return feq.get("http://127.0.0.1:4193/bla.json").then(response => {
        expect(cache.request.headers["X-Bla1"]).to.equal("bla1");
        expect(cache.request.headers["X-Bla2"]).to.equal("bla2");
        expect(response.body.are_we_bla_yet).to.be.false;
        expect(response.bla1).to.equal(1);
        expect(response.bla2).to.equal(2);
      });
    });
  });
});
