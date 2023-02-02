export default {
  async fetch(request: Request): Promise<Response> {
    const STAGING_HOST: string =
      "us-central1-bayanplus-staging.cloudfunctions.net";
    const url = new URL(request.url);
    url.protocol = "https:";
    url.hostname = STAGING_HOST;
    url.pathname = `/api${url.pathname}`;
    return fetch(new Request(url.toString(), request));
  },
};
