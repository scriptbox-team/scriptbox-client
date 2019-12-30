/**
 * An interface for communicating with the login server.
 *
 * @export
 * @abstract
 * @class LoginAPIInterface
 */
export default abstract class LoginAPIInterface {
    /**
     * Make a login request to the login server.
     *
     * @abstract
     * @param {string} username The username to log in with.
     * @param {string} password The password to log in with.
     * @returns {Promise<string>} A promise which resolves to the received login token.
     * @memberof LoginAPIInterface
     */
    public abstract login(username: string, password: string): Promise<string>;
    /**
     * Make a signup request to the login server.
     *
     * @abstract
     * @param {string} username The username to sign up with.
     * @param {string} email The email to sign up with.
     * @param {string} password The password to sign up with.
     * @returns {Promise<string>} A promise which resolves to the status given from signing up.
     * @memberof LoginAPIInterface
     */
    public abstract signup(username: string, email: string, password: string): Promise<string>;
    /**
     * Set the URL to use for the login server.
     *
     * @abstract
     * @param {string} ip The IP to use
     * @memberof LoginAPIInterface
     */
    public abstract setURL(ip: string): void;
}
