export async function getConfig() {
    return (await import("@/config.json")).config;
}

export function getConfigSync() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("@/config.json").config;
}