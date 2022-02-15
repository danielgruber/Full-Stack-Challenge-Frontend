
import Product from "../model/Product";
import User from "../model/User";
import UserRole from "../model/UserRole";
import axios from "./httpcommon";
import { AuthResponse } from "./response/authResponse";

/**
 * Provides access to the APIs for Commerce.
 */
class API {
    currentToken: string | undefined;

    constructor() {
        // Add a request interceptor for token
        axios.interceptors.request.use( (config) => {
            if (this.currentToken != undefined) {
                if (config != null && config.headers != null) {
                    config.headers.AuthAuthorization = this.currentToken
                }
            }

            return config;
        });

        axios.interceptors.response.use(
            response => response,
            (err) => {
                if (err.response.data) {
                    if (err.response.data.message) {
                        return Promise.reject(err.response.data.message);
                    } else if (err.response.data.exception) {
                        return Promise.reject(err.response.data.exception);
                    }
                }
                
                return Promise.reject(err);
            }
        )
    }

    authenticate = (username: string, password: string) => {
        return axios.post<any, AuthResponse>("/authenticate", {
            username,
            password
        }).then(response => {
            this.currentToken = response.token;
        });
    }

    createAccount = (username: string, password: string, userRole: UserRole) => {
        return axios.post<any, User>("/user", {
            username,
            password,
            userRole
        });
    }

    currentUser = () => {
        return axios.get<User>("/user")
    }

    createProduct = (name: string, cost: number, amountAvailable: number) => {
        return axios.post<any, Product>("/product", {
            name,
            cost,
            amountAvailable
        });
    }

    createOrUpdateProduct = (id: string, name?: string, cost?: number, amountAvailable?: number) => {
        return axios.put<any, Product>("/product/" + id, {
            name,
            cost,
            amountAvailable
        });
    }

    fetchProducts = () => {
        return axios.get<Array<Product>>("/products")
    }

    deposit = (coins: number[]) => {
        return axios.post("/deposit", {
            coins
        })
    }

    buy = (productId: string, productAmount: number) => {
        return axios.post("/deposit", {
            productId, productAmount
        })
    }

    reset = () => {
        return axios.post("/reset")
    }

    logout = () => {
        this.currentToken = undefined
    }
}

export default new API()
