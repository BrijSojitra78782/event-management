import { AUDIT_BASE_URL } from "@/config"

export const getCategories = async (token:string) => {
    let res = await fetch(`${AUDIT_BASE_URL}/category/all`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    let result = await res.json();
    if (!res.ok) {
        throw new Error(result.errors[0].msg)
    }
    return result;
}

export const getCategoryProperties = async (value: number,token: string) => {
    let res = await fetch(`${AUDIT_BASE_URL}/category/${value}/properties`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    let result = await res.json();
    if (!res.ok) {
        throw new Error(result.errors[0].msg)
    }
    return result;
}

export const createAsset = async (asset: any,token:string) => {
    let res = await fetch(`${AUDIT_BASE_URL}/asset/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(asset)
    });
    let result = await res.json();
    if (!res.ok) {
        throw new Error(result.errors[0].msg)
    }
    return result;
}


export const getPropertyValues = async (token:string,categoryId:string)=>{
    let res = await fetch(`${AUDIT_BASE_URL}/category/${categoryId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    });
    let result = await res.json();
    if (!res.ok) {
        throw new Error(result.errors[0].msg)
    }
    return result;
}