import { AxiosResponse } from "axios"
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
            this.currentUser().catch(() => this.logout())
        }
    }

    authenticate = (username: string, password: string) => {
        return axios.post<AuthResponse>("/authenticate", {
            username,
            password
        }).then(response => {
            localStorage.setItem(TOKEN_KEY, response.data.token)
            this.currentToken = response.data.token

            this.loginChange?.apply(this)
        })
    }

    createAccount = (username: string, password: string, userRole: UserRole) => {
        return axios.post<User>("/user", {
            username,
            password,
            userRole
        })
    }

    currentUser = () => {
        return axios.get<User>("/user")
    }

    createProduct = (name: string, cost: number, amountAvailable: number) => {
        return axios.post<Product>("/product", {
            name,
            cost,
            amountAvailable
        })
    }

    createOrUpdateProduct = (id: string, name?: string, cost?: number, amountAvailable?: number) => {
        return axios.put<Product>("/product/" + id, {
            name,
            cost,
            amountAvailable
        })
    }

    fetchProducts = () => {
        return axios.get<Array<Product>>("/product")
    }

    deposit = (coins: number[]) => {
        return axios.post("/deposit", {
            coins
        })
    }

    buy = (productId: string, productAmount: number) => {
        return axios.post<BuyResponse>("/deposit", {
            productId, productAmount
        })
    }

    reset = () => {
        return axios.post("/reset")
    }

    logout = () => {
        console.log("Logging out")

        this.currentToken = null

        localStorage.removeItem(TOKEN_KEY)

        this.loginChange?.apply(this)
    }
}

export default new API()
