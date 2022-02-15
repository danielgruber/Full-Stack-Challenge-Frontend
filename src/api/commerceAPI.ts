import { AxiosResponse } from "axios"
import { sign } from "crypto"
import Product from "../model/Product"
import User from "../model/User"
import UserRole from "../model/UserRole"
import axios from "./httpcommon"
import { AuthResponse } from "./response/authResponse"
import BuyResponse from "./response/buyResponse"

const TOKEN_KEY = "ven_mach_token"

/**
 * Provides access to the APIs for Commerce.
 */
class API {
    currentToken: string | null
    loginChange?: (() => void) = undefined
    private _user: User | null = null

    constructor() {
        this.currentToken = localStorage.getItem(TOKEN_KEY)

        // Add a request interceptor for token
        axios.interceptors.request.use( (config) => {
            if (this.currentToken != undefined) {
                if (config != null && config.headers != null) {
                    config.headers.Authorization = "Bearer " + this.currentToken
                }
            }

            return config
        })

        axios.interceptors.response.use(
            response => response,
            (err) => {
                console.log(err)
                if (err.response.status == 401) {
                    this.logout()
                }
                
                if (err.response.data) {
                    if (err.response.data.message) {
                        return Promise.reject(err.response.data.message)
                    } else if (err.response.data.exception) {
                        return Promise.reject(err.response.data.exception)
                    }
                }

                return Promise.reject(err)
            }
        )

        // check if token is valid
        if (this.currentToken) {
            this.currentUser().then(() => this.loginChange?.apply(this)).catch(() => this.logout())
        }
    }

    public set user(value: User | null) {
        this._user = value
        this.loginChange?.apply(this)
    }

    public get user(): User | null {
        return this._user
    }


    authenticate = (username: string, password: string, signal: AbortSignal|undefined = undefined) => {
        return axios.post<AuthResponse>("/authenticate", {
            username,
            password
        }, {
            signal: signal
        }).then(response => {
            localStorage.setItem(TOKEN_KEY, response.data.token)
            this.currentToken = response.data.token

            this.currentUser().then(() => this.loginChange?.apply(this))
        })
    }

    createAccount = (username: string, password: string, userRole: UserRole, signal: AbortSignal|undefined = undefined) => {
        return axios.post<User>("/user", {
            username,
            password,
            userRole
        }, {
            signal: signal
        })
    }

    currentUser = (signal: AbortSignal|undefined = undefined) => {
        return axios.get<User>("/user", {
            signal: signal
        }).then((response) => {
            this.user = response.data
            return response
        })
    }

    createProduct = (name: string, cost: number, amountAvailable: number, signal: AbortSignal|undefined = undefined) => {
        return axios.post<Product>("/product", {
            name,
            cost,
            amountAvailable
        }, {
            signal: signal
        })
    }

    createOrUpdateProduct = (id: string, name?: string, cost?: number, amountAvailable?: number, signal: AbortSignal|undefined = undefined) => {
        return axios.put<Product>("/product/" + id, {
            name,
            cost,
            amountAvailable
        }, {
            signal: signal
        })
    }

    fetchProducts = (signal: AbortSignal|undefined = undefined) => {
        return axios.get<Array<Product>>("/product", {
            signal: signal
        })
    }

    deposit = (coins: number[], signal: AbortSignal|undefined = undefined) => {
        return axios.post("/deposit", {
            coins
        }, {
            signal: signal
        })
    }

    buy = (productId: string, productAmount: number, signal: AbortSignal|undefined = undefined) => {
        return axios.post<BuyResponse>("/buy", {
            productId, productAmount
        }, {
            signal: signal
        })
    }

    reset = (signal: AbortSignal|undefined = undefined) => {
        return axios.post("/reset", {}, {
            signal: signal
        })
    }

    logout = (signal: AbortSignal|undefined = undefined) => {
        console.log("Logging out")

        this.currentToken = null
        this.user = null

        localStorage.removeItem(TOKEN_KEY)

        this.loginChange?.apply(this)
    }
}

export default new API()
