export enum DebugLogType {
    Input
}

let enabled: DebugLogType[] = [];

export function log(type: DebugLogType, ...message: any) {
    if (enabled.find((enabledType) => enabledType === type) !== undefined) {
        console.log(...message);
    }
}

export function setDebugLogTypes(types: DebugLogType[]) {
    enabled = types;
}
