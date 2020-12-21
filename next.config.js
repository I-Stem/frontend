const withPlugins = require("next-compose-plugins");
const lessToJS = require("less-vars-to-js");
const fs = require("fs");
const path = require("path");

const withCSS = require("@zeit/next-css");
const withLess = require("@zeit/next-less");
const withSass = require("@zeit/next-sass");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
enabled: process.env.ANALYZE === 'true'
});
const nextRuntimeDotenv = require("next-runtime-dotenv");

const withConfig = nextRuntimeDotenv({
  public: [
    "API_URL",
    "API_KEY",
    "BASE_URL",
    "RESET_PASSWORD_URL",
    "VERIFICATION_URL",
  ],
});

const themeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, "./public/static/css/theme.less"),
    "utf8"
  )
);

const nextConfig = {
  analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: "static",
      reportFilename: "../bundles/server.html",
    },
    browser: {
      analyzerMode: "static",
      reportFilename: "../bundles/client.html",
    },
  },
  publicRuntimeConfig: {
    PROXY_MODE: process.env.PROXY_MODE,
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
    STATIC_PATH: process.env.STATIC_PATH,
  },
};

module.exports = withConfig(
  withPlugins(
    [
      [
        withCSS(
          withSass({
            cssModules: true,
            ...withLess({
              lessLoaderOptions: {
                javascriptEnabled: true,
                modifyVars: themeVariables,
                importLoaders: 0,
              },
              cssLoaderOptions: {
                importLoaders: 3,
                localIdentName: "[local]",
              },
              webpack: (configParam, { isServer }) => {
                const config = { ...configParam };
                if (isServer) {
                  const antStyles = /antd\/.*?\/style.*?/;
                  const origExternals = [...config.externals];
                  config.externals = [
                    (context, request, callback) => {
                      if (request.match(antStyles)) return callback();
                      if (typeof origExternals[0] === "function") {
                        origExternals[0](context, request, callback);
                      } else {
                        callback();
                      }
                    },
                    ...(typeof origExternals[0] === "function"
                      ? []
                      : origExternals),
                  ];

                  config.module.rules.unshift({
                    test: antStyles,
                    use: "null-loader",
                  });
                }
                return config;
              },
            }),
          })
        ),
      ],
      [withBundleAnalyzer],
    ],
    nextConfig
  )
);
