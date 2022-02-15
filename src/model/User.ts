import UserRole from "./UserRole";

export default interface User {
    id: string;
    username: string;
    password: string;
    depositCents: number;
    role: UserRole;
}
