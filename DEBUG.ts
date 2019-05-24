import config from "./config.json";

export const debug = {
    inDebugMode: config.run.mode === "debug",
    log: (arg: any) => {
        if (debug.inDebugMode) {
            console.log(arg);
        }
    }
};