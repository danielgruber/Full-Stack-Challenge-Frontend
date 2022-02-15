interface Config {
    apiURL: string
}

var config: Config = {
    apiURL: "http://localhost:8080"
};

if (process.env.REACT_APP_BACKEND_ADDRESS != null) {
// eslint-disable-next-line no-undef
    config.apiURL = process.env.REACT_APP_BACKEND_ADDRESS;
}

export default config;
