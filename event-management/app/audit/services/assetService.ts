import { AUDIT_BASE_URL } from "@/config";

export const getAssetDetails = async (tag: string,token:string) => {
    const response = await fetch(`${AUDIT_BASE_URL}/asset/${tag}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.errors[0].msg)
    }
    return result;
}

export const genearateQr = async (tag: string,token:string,size:string = 'XL') => {
    const response = await fetch(`${AUDIT_BASE_URL}/asset/${tag}/generateQr?size=${size}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.errors[0].msg)
    }
    return result;
}

export const generateAllQRs = async (token:string) => {
    const response = await fetch(`${AUDIT_BASE_URL}/asset/all/generateQr`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.errors[0].msg)
    }
    return result;
}