import {LoginCard} from "../components/login/LoginModal";

const API_SERVER = "http://localhost:8000"

export const signInRequest = (data: LoginCard) => {
    const requestOptions: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }
    return fetch(`${API_SERVER}/auth/local/signin`, requestOptions).then((res) => res.json())
}