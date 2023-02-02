export default {
  async fetch(request: Request): Promise<Response> {
    const PRODUCTION_HOST: string = "us-central1-bayanplus.cloudfunctions.net";
    const url = new URL(request.url);
    url.protocol = "https:";
    url.hostname = PRODUCTION_HOST;
    url.pathname = `/api${url.pathname}`;
    return fetch(new Request(url.toString(), request));
  },
};
