// Each build replaces only its explicitly configured public/slides/<slug> output.
const isRsi = process.env.PIXELCARD_SLIDE_DECK === "rsi-for-infra";
const isDust = process.env.PIXELCARD_SLIDE_DECK === "dust-lora";
const isLingSheng = process.env.PIXELCARD_SLIDE_DECK === "lingsheng-collaboration";
let base = "/";
export default {
  ...(isRsi ? { publicDir: "public/rsi-for-infra" } : isDust ? { publicDir: "public/dust-lora" } : isLingSheng ? { publicDir: "public/lingsheng-collaboration" } : {}),
  build: { emptyOutDir: true },
  plugins: [{
    name: "clean-generated-html",
    configResolved(config) { base = config.base; },
    configureServer(server) {
      if (!isLingSheng) return;
      server.middlewares.use((req, res, next) => {
        const end = res.end;
        res.end = function (chunk, ...args) {
          if (typeof chunk === "string" && chunk.includes("</head>")) {
            chunk = chunk.replace("</head>", `<link rel="stylesheet" href="${base}lingsheng-theme.css">\n</head>`);
          }
          return end.call(this, chunk, ...args);
        };
        next();
      });
    },
    transformIndexHtml: {
      order: "post",
      handler: (html) => {
        const clean = html.replace(/[\t ]+$/gm, "");
        // Load deck styles before any slide, including direct numbered routes.
        return isRsi || isDust || isLingSheng
          ? clean.replace("</head>", `<link rel="stylesheet" href="${base}${isLingSheng ? 'lingsheng-theme.css' : 'style.css'}">\n</head>`)
          : clean;
      },
    },
  }],
};
