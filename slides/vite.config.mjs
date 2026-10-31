// Each build replaces only its explicitly configured public/slides/<slug> output.
const isRsi = process.env.PIXELCARD_SLIDE_DECK === "rsi-for-infra";
let base = "/";
export default {
  ...(isRsi ? { publicDir: "public/rsi-for-infra" } : {}),
  build: { emptyOutDir: true },
  plugins: [{
    name: "clean-generated-html",
    configResolved(config) { base = config.base; },
    transformIndexHtml: {
      order: "post",
      handler: (html) => {
        const clean = html.replace(/[\t ]+$/gm, "");
        // Load deck styles before any slide, including direct numbered routes.
        return isRsi
          ? clean.replace("</head>", `<link rel="stylesheet" href="${base}style.css">\n</head>`)
          : clean;
      },
    },
  }],
};
