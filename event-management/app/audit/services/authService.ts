import { API_BASE_URL } from "@/config";
import { publicKeyPem } from "@/utils/publicKey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import forge from 'node-forge';

export const login = async (email: string, password : string) => {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encryptedPassword = forge.util.encode64(publicKey.encrypt(password, 'RSA-OAEP'));
    console.log(encryptedPassword);
    const response = await fetch(API_BASE_URL + '/auth/login', {
        method: 'POST',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            email:email,
            password: encryptedPassword 
        })
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.errors[0].msg);
    }
    await AsyncStorage.setItem("authToken", result.token);
    return result;
}

export const verifyToken = async (token:string) => {
    const response = await fetch(API_BASE_URL + "/auth/verify-token", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const result = await response.json();
    if (!response.ok) {
        await removeToken();
        if (response.status === 401) {
            throw new Error(result.errors[0].msg);
        } else if (response.status === 403) {
            throw new Error("expired login");
        }
        throw new Error(result.errors[0].msg);
    }
    return result;
}


export const getToken = async (): Promise<string | null> => {
    let token = await AsyncStorage.getItem("authToken");
    return token;
};

export const removeToken = async () => {
    await AsyncStorage.removeItem("authToken");
};
