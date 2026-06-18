(function () {
  const script = document.currentScript;
  const trackingKey = script && script.getAttribute("data-project-key");

  if (!trackingKey) {
    console.warn("[Rewind.dev] Missing data-project-key");
    return;
  }

  const API_URL = new URL("/api/ingest", script.src).toString();
  const SESSION_KEY = "rewind_session_token";

  function getSessionToken() {
    let token = localStorage.getItem(SESSION_KEY);

    if (!token) {
      token =
        "sess_" +
        Math.random().toString(36).slice(2) +
        "_" +
        Date.now().toString(36);

      localStorage.setItem(SESSION_KEY, token);
    }

    return token;
  }

  const sessionToken = getSessionToken();
  const queue = [];

  function detectBrowser() {
    const ua = navigator.userAgent;

    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";

    return "Unknown";
  }

  function detectOS() {
    const ua = navigator.userAgent;

    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac")) return "macOS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";

    return "Unknown";
  }

  function getSelector(el) {
    if (!el) return "";

    if (el.id) return "#" + el.id;

    const testId =
      el.getAttribute && el.getAttribute("data-testid")
        ? el.getAttribute("data-testid")
        : "";

    if (testId) return `[data-testid="${testId}"]`;

    const rewindId =
      el.getAttribute && el.getAttribute("data-rewind-track")
        ? el.getAttribute("data-rewind-track")
        : "";

    if (rewindId) return `[data-rewind-track="${rewindId}"]`;

    if (el.className && typeof el.className === "string") {
      const className = el.className.trim().split(/\s+/)[0];
      if (className) return el.tagName.toLowerCase() + "." + className;
    }

    return el.tagName ? el.tagName.toLowerCase() : "";
  }

  function safeText(text) {
    if (!text) return "";
    return String(text).replace(/\s+/g, " ").trim().slice(0, 80);
  }

  function isSensitiveElement(el) {
    if (!el) return false;

    const tag = el.tagName ? el.tagName.toLowerCase() : "";
    const type = el.type ? String(el.type).toLowerCase() : "";
    const name = el.name ? String(el.name).toLowerCase() : "";
    const id = el.id ? String(el.id).toLowerCase() : "";

    const sensitiveTypes = ["password", "email", "tel", "number"];
    const sensitiveWords = ["password", "token", "secret", "otp", "card", "cvv"];

    if (sensitiveTypes.includes(type)) return true;

    return sensitiveWords.some(
      (word) => name.includes(word) || id.includes(word)
    );
  }

  function findTrackableElement(target) {
    if (!target || !target.closest) return null;

    return target.closest(
      [
        "button",
        "a",
        "input",
        "select",
        "textarea",
        "[role='button']",
        "[data-rewind-track]",
      ].join(",")
    );
  }

  function addEvent(type, payload) {
    queue.push({
      type,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      payload,
    });
  }

  function flush() {
    if (queue.length === 0) return;

    const events = queue.splice(0, queue.length);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      body: JSON.stringify({
        trackingKey,
        sessionToken,
        metadata: {
          browser: detectBrowser(),
          os: detectOS(),
          device: window.innerWidth < 768 ? "Mobile" : "Desktop",
          screenSize: window.innerWidth + "x" + window.innerHeight,
        },
        events,
      }),
    }).catch(function () {
      queue.unshift.apply(queue, events);
    });
  }

  addEvent("page_load", {
    title: document.title,
    referrer: document.referrer,
  });

  document.addEventListener(
    "click",
    function (event) {
      const trackable = findTrackableElement(event.target);

      if (!trackable) {
        return;
      }

      const tag = trackable.tagName ? trackable.tagName.toLowerCase() : "";

      let text = "";

      if (!isSensitiveElement(trackable)) {
        text = safeText(
          trackable.innerText ||
            trackable.textContent ||
            trackable.value ||
            trackable.getAttribute("aria-label") ||
            trackable.getAttribute("title") ||
            ""
        );
      }

      addEvent("click", {
        tag,
        text: text || getSelector(trackable),
        selector: getSelector(trackable),
        role: trackable.getAttribute("role") || "",
        x: event.clientX,
        y: event.clientY,
      });
    },
    true
  );

  const originalConsoleError = console.error;

  console.error = function () {
    const args = Array.from(arguments).map(function (arg) {
      if (arg instanceof Error) {
        return {
          message: arg.message,
          stack: arg.stack,
        };
      }

      return String(arg);
    });

    addEvent("console_error", {
      message: args,
    });

    originalConsoleError.apply(console, arguments);
  };

  const originalFetch = window.fetch;

  window.fetch = function () {
    const start = Date.now();
    const args = arguments;
    const url = args[0];

    return originalFetch
      .apply(this, args)
      .then(function (response) {
        if (!response.ok) {
          addEvent("network_fail", {
            url: typeof url === "string" ? url : url && url.url,
            status: response.status,
            responseTime: Date.now() - start,
          });
        }

        return response;
      })
      .catch(function (error) {
        addEvent("network_fail", {
          url: typeof url === "string" ? url : url && url.url,
          status: 0,
          responseTime: Date.now() - start,
          message: error && error.message ? error.message : "Network request failed",
        });

        throw error;
      });
  };

  let lastUrl = window.location.href;

  setInterval(function () {
    if (window.location.href !== lastUrl) {
      addEvent("route_change", {
        from: lastUrl,
        to: window.location.href,
      });

      lastUrl = window.location.href;
    }
  }, 800);

  setInterval(flush, 5000);

  window.addEventListener("beforeunload", flush);

  window.RewindDev = {
    track: addEvent,
    flush,
  };

  console.log("[Rewind.dev] Tracker loaded");
})();