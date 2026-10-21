// Each build replaces only its explicitly configured public/slides/<slug> output.
export default {
  build: { emptyOutDir: true },
  plugins: [{
    name: "clean-generated-html",
    transformIndexHtml: {
      order: "post",
      handler: (html) => html.replace(/[\t ]+$/gm, ""),
    },
  }],
};
