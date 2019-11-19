import isIP from "is-ip";

export default class IPConverter {
    public static to(protocol: string, ipAndPort: string) {
        const portStart = ipAndPort.lastIndexOf(":");
        const ip = ipAndPort.substr(0, portStart);
        const port = ipAndPort.substr(portStart + 1, ipAndPort.length - portStart + 1);
        const portString = port !== undefined ? `:${port}` : ``;
        if (isIP.v6(ip)) {
            return `${protocol}://[${ip}]${portString}`;
        }
        else {
            return `${protocol}://${ip}${portString}`;
        }
    }
    public static toHTTP(ipAndPort: string) {
        return IPConverter.to("http", ipAndPort);
    }
    public static toWS(ipAndPort: string) {
        return IPConverter.to("ws", ipAndPort);
    }
}
