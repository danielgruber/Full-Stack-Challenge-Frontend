import Product from "../../model/Product";

export default interface BuyResponse {
  total: number
  product: Product
  numberOfProduct: number
  change: number[]
}
