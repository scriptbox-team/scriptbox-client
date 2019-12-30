import isIP from "is-ip";

/**
 * A static class which can convert an IP to various web formats.
 *
 * @export
 * @class IPConverter
 */
export default class IPConverter {
    /**
     * Convert from an IP to a particular protocol.
     *
     * @static
     * @param {string} protocol The protocol to use (http, https, ws, etc.)
     * @param {string} ipAndPort The IP and port together in a single string.
     * @returns The string formatted as a URL
     * @memberof IPConverter
     */
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
    /**
     * Convert an IP to an HTTP URL.
     *
     * @static
     * @param {string} ipAndPort The IP and port together in a single string.
     * @returns An HTTP URL to the IP.
     * @memberof IPConverter
     */
    public static toHTTP(ipAndPort: string) {
        return IPConverter.to("http", ipAndPort);
    }
    /**
     * Convert an IP to an HTTPS URL.
     *
     * @static
     * @param {string} ipAndPort The IP and port together in a single string.
     * @returns An HTTPS URL to the IP.
     * @memberof IPConverter
     */
    public static toHTTPS(ipAndPort: string) {
        return IPConverter.to("https", ipAndPort);
    }
    /**
     * Convert an IP to a WS URL.
     *
     * @static
     * @param {string} ipAndPort The IP and port together in a single string.
     * @returns A WS URL to the IP.
     * @memberof IPConverter
     */
    public static toWS(ipAndPort: string) {
        return IPConverter.to("ws", ipAndPort);
    }
}
