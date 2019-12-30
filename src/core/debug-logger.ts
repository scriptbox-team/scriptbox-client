export enum DebugLogType {
    Input,
    UI
}

let enabled: DebugLogType[] = [];


/**
 * Log to the console if the debug log type used is enabled.
 *
 * @export
 * @param {DebugLogType} type The debug log type to use.
 * @param {...any} message The message to log.
 */
export function log(type: DebugLogType, ...message: any) {
    if (enabled.find((enabledType) => enabledType === type) !== undefined) {
        console.log(...message);
    }
}

/**
 * Set which debug log types are enabled.
 *
 * @export
 * @param {DebugLogType[]} types An array of types to enable.
 */
export function setDebugLogTypes(types: DebugLogType[]) {
    enabled = types;
}
