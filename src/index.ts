import { ViteDevServer } from "vite";
import { Proxy } from "@domoinc/ryuu-proxy";
import { IncomingMessage, ServerResponse } from "http";

export function domoProxy() {
    return {
        name: "domo-proxy",
        configureServer(server: ViteDevServer) {
            const manifest = loadManifest();

            const proxy = new Proxy({ manifest });

            server.middlewares.use(
                (
                    req: IncomingMessage,
                    res: ServerResponse,
                    next: (err?: any) => void
                ) => {
                    if (isDomoRequest(req.url || "")) {
                        proxy
                            .stream(req)
                            .then(({ data }) =>
                                data.pipe(res).on("error", () => {
                                    res.statusCode = 500;
                                    res.end("Error processing response stream");
                                })
                            )
                            .catch((err: any) => {
                                if (err.response) {
                                    res.statusCode = err.response.status;
                                    res.end(
                                        `Error: ${err.response.statusText}`
                                    );
                                } else {
                                    res.statusCode = 500;
                                    res.end("Internal Server Error");
                                }
                            });
                    } else {
                        next();
                    }
                }
            );
        },
    };
}

import { readFileSync } from "fs";
import { resolve } from "path";

function isDomoRequest(url: string): boolean {
    const domoPattern = /^\/domo\/.+\/v\d/;
    const dataPattern = /^\/data\/v\d\/.+/;
    const sqlQueryPattern = /^\/sql\/v\d\/.+/;
    const dqlPattern = /^\/dql\/v\d\/.+/;
    const apiPattern = /^\/api\/.+/;

    return (
        domoPattern.test(url) ||
        dataPattern.test(url) ||
        sqlQueryPattern.test(url) ||
        dqlPattern.test(url) ||
        apiPattern.test(url)
    );
}

function loadManifest() {
    try {
        const manifestPath = resolve(process.cwd(), "public/manifest.json");
        const manifestContent = readFileSync(manifestPath, "utf-8");
        return JSON.parse(manifestContent);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to load manifest.json: ${error.message}`);
        } else {
            throw new Error("Failed to load manifest.json: Unknown error");
        }
    }
}
