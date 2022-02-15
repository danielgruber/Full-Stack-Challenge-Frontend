import User from "./User";

export default interface Product {
    id: string;
    amountAvailable: number;
    cost: number;
    productName: string;
    seller: User;
}
