# Vite Plugin Domo Proxy

## Overview

`vite-plugin-domo-proxy` is a Vite plugin designed to proxy requests to Domo APIs during development. This allows for seamless integration and testing of Domo data within your Vite-powered applications.

## Installation

Install `vite-plugin-domo-proxy` as a development dependency:

```bash
npm install vite-plugin-domo-proxy --save-dev
# or
yarn add vite-plugin-domo-proxy --dev
```

## Prerequisites

-   A properly configured `public/manifest.json` file required by Domo.
-   Authentication via the Domo CLI (`domo login` must be completed).
-   A Vite-powered development environment.

## Features

-   Proxies requests to Domo APIs for a seamless development experience.
-   Simplifies integration with Domo environments by removing boilerplate dependencies.
-   Works out of the box with the Domo CLI and `public/manifest.json`.

## Usage

Add the plugin to your `vite.config.js`:

```javascript
import domoProxy from "vite-plugin-domo-proxy";

export default defineConfig({
    plugins: [domoProxy()],
});
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.
