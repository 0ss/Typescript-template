(function () {
  "use strict";
  var endpoint = "https://edge.bayanplus.co/event";
  var win = window;
  var loc = win.location;
  var eventListener = win.addEventListener;
  var doc = win.document;
  var bdy = doc.body;
  var nav = win.navigator;
  var sc = win.screen;
  var script = doc.currentScript;
  var warn = console.warn;
  var userInfo = {};
  var storage = win.localStorage;
  var localStorageUserKey = "bp_user";
  var t = performance.timing;
  var id = Math.random().toString(36).substring(2, 15);
  eventListener("DOMContentLoaded", () => {
    doc.querySelectorAll("[data-bayanplus-event]").forEach((e) => {
      var eventName = e.getAttribute("data-bayanplus-event");
      if (e.tagName === "FORM") {
        e.onsubmit = () => event(eventName);
      } else {
        e.onclick = () => event(eventName);
      }
    });
  });
  /**
   * script data
   */
  var trackLocalhost = script.hasAttribute("data-track-localhost");
  var ignorePaths =
    script.getAttribute("data-exclude") &&
    script.getAttribute("data-exclude").split(",");
  if (ignorePaths && ignorePaths.length > 0)
    warn("Ignored paths are: ", ...ignorePaths);
  /**
   * functions shortcut
   */
  var rnd = Math.round;

  /**
   * Other variables
   */
  var payload = {};

  // allow using localhost
  if (
    !trackLocalhost &&
    (/^localhost(.*)$|^127(\.[0-9]{1,3}){3}$/is.test(loc.hostname) ||
      loc.protocol === "file:")
  ) {
    warn("localhost");
    return;
  }

  // send events
  function event(name) {
    var isPageView = name === "pageview";
    if (ignorePaths) {
      for (var i = 0; i < ignorePaths.length; i++) {
        if (
          isPageView &&
          loc.pathname.match(
            new RegExp(
              "^" +
                ignorePaths[i]
                  .trim()
                  .replace(/\*\*/g, ".*")
                  .replace(/([^\.])\*/g, "$1[^\\s/]*") +
                "/?$"
            )
          )
        )
          return warn("Page is ignored");
      }
    }

    //project id
    payload.pid = script.getAttribute("data-pid");
    //event name
    payload.n = name;
    // url
    payload.u = loc.href;
    // referer
    payload.r = doc.referrer || null;
    // langauge
    payload.l = nav.language;
    // network speed
    payload.ns = nav.connection && nav.connection.effectiveType;
    // screen width
    payload.sw = rnd(win.innerWidth);
    // screen height
    payload.sh = rnd(win.innerHeight);
    // host
    payload.h = loc.host;
    // device memory
    payload.dm = nav.deviceMemory;
    //cpu
    payload.c = nav.hardwareConcurrency;
    // page load
    payload.pl = t.loadEventEnd - t.navigationStart;
    // time to first byte
    payload.ttfb = t.responseStart - t.navigationStart;
    // fingerprint
    payload.fp = generateFingerprint();
    var url = endpoint + "?";
    for (var payloadKey in payload) {
      if (payload[payloadKey])
        url += `${payloadKey}=${encodeURIComponent(payload[payloadKey])}&`;
    }
    for (var userKey in userInfo) {
      // check if value is object
      url += `user[${userKey}]=${encodeURIComponent(userInfo[userKey])}&`;
    }
    url = url.slice(0, -1);
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.send();
  }

  var his = window.history;
  if (his.pushState) {
    var pushState = his["pushState"];

    his.pushState = function () {
      pushState.apply(this, arguments);
      page();
    };

    eventListener("popstate", page);
  }
  if (!bdy) {
    eventListener("load", page);
  } else {
    page();
  }
  function page() {
    if (storage.getItem(localStorageUserKey)) {
      userInfo = JSON.parse(storage.getItem(localStorageUserKey));
      setTimeout(() => {
        event("pageview");
      }, 500);
    } else {
      setTimeout(() => {
        event("pageview");
      }, 500);
    }
  }
  // set get
  function set(object) {
    for (var key in object) {
      userInfo[key] = object[key];
    }
    storage.setItem(localStorageUserKey, JSON.stringify(userInfo));
  }
  function get() {
    return userInfo;
  }

  function generateFingerprint() {
    var canvas = getCanvasFingerPrint();
    var navigator = getNavigatorProperties();
    var plugins = getPlugins();
    var webgl = getWebGLFingerPrint();
    var fingerprint = canvas + navigator + plugins + webgl;
    return cyrb53(fingerprint);
  }

  function getPlugins() {
    var plugins = [];
    for (var i = 0; i < nav.plugins.length; i++) {
      plugins.push([nav.plugins[i].name, nav.plugins[i].filename]);
    }
    return plugins.join(";");
  }

  function getNavigatorProperties() {
    var userAgent = nav.userAgent || "";
    var hardware = nav.hardwareConcurrency || 0;
    var language = nav.language || "";
    var languages = nav.languages.join(",") || "";
    var colorDepth = sc.colorDepth || 0;
    var deviceMemory = nav.deviceMemory || 0;
    var screenResolution = [sc.width, sc.height, sc.colorDepth].join("x");
    var timezoneOffset = new Date().getTimezoneOffset();
    var fingerprint =
      userAgent +
      hardware +
      language +
      languages +
      colorDepth +
      deviceMemory +
      screenResolution +
      timezoneOffset;
    return fingerprint;
  }
  function getWebGLFingerPrint() {
    const canvas = doc.createElement("canvas");
    const gl = canvas.getContext("webgl")
      ? canvas.getContext("webgl")
      : canvas.getContext("experimental-webgl");
    if (gl && "getExtension" in gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        return [
          (gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "").toString(),
          (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "").toString(),
        ].join(",");
      }
    }
    return "";
  }
  function getCanvasFingerPrint() {
    try {
      var canvas = doc.createElement("canvas");
      var ctx = canvas.getContext("2d");
      var txt = "https://bayanplus.co";
      if (ctx !== null) {
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText(txt, 4, 17);
        return canvas.toDataURL();
      }
    } catch (e) {
      return "";
    }
  }

  function cyrb53(str, seed = 256) {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 =
      Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
      Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
      Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
      Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }
  window.bayanplus = {
    event,
    user: {
      set,
      get,
    },
  };
})();
