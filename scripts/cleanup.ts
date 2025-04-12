import { rm } from "fs/promises";
import { glob } from "glob";

// Remove all TypeScript compiler output
(async () => {
    const files = await glob("**/*.js?(.map)", {
        ignore: [
            "**/node_modules/**",
            "**/dist/**",
            "src/main/globals.js"
        ]
    });

    const calls: Promise<void>[] = [];

    for(const path of files) {
        calls.push(rm(path));
    }

    await Promise.all(calls)
        .then(results => console.log(`\x1b[92mCleanup successful!\x1b[0m\nDeleted ${results.length} files.`))
        .catch(err => console.error("\x1b[91mFailed to execute!\x1b[0m\n", err))
})();