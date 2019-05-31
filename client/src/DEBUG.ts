import config from "../../config.json";

export const debug = {
    inDebugMode: config.run.mode === "debug",
    log: (args: any) => {
        if (debug.inDebugMode) {
            console.log(args);
        }
    }
};