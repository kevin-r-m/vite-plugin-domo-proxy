"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domoProxy = domoProxy;
const ryuu_proxy_1 = require("@domoinc/ryuu-proxy");
function domoProxy() {
    return {
        name: "domo-proxy",
        configureServer(server) {
            const manifest = loadManifest();
            const proxy = new ryuu_proxy_1.Proxy({ manifest });
            server.middlewares.use((req, res, next) => {
                if (isDomoRequest(req.url || "")) {
                    proxy
                        .stream(req)
                        .then(({ data }) => data.pipe(res).on("error", () => {
                        res.statusCode = 500;
                        res.end("Error processing response stream");
                    }))
                        .catch((err) => {
                        if (err.response) {
                            res.statusCode = err.response.status;
                            res.end(`Error: ${err.response.statusText}`);
                        }
                        else {
                            res.statusCode = 500;
                            res.end("Internal Server Error");
                        }
                    });
                }
                else {
                    next();
                }
            });
        },
    };
}
const fs_1 = require("fs");
const path_1 = require("path");
function isDomoRequest(url) {
    const domoPattern = /^\/domo\/.+\/v\d/;
    const dataPattern = /^\/data\/v\d\/.+/;
    const sqlQueryPattern = /^\/sql\/v\d\/.+/;
    const dqlPattern = /^\/dql\/v\d\/.+/;
    const apiPattern = /^\/api\/.+/;
    return (domoPattern.test(url) ||
        dataPattern.test(url) ||
        sqlQueryPattern.test(url) ||
        dqlPattern.test(url) ||
        apiPattern.test(url));
}
function loadManifest() {
    try {
        const manifestPath = (0, path_1.resolve)(process.cwd(), "public/manifest.json");
        const manifestContent = (0, fs_1.readFileSync)(manifestPath, "utf-8");
        return JSON.parse(manifestContent);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to load manifest.json: ${error.message}`);
        }
        else {
            throw new Error("Failed to load manifest.json: Unknown error");
        }
    }
}
