import { AUDIT_BASE_URL } from "@/config";

export const getUsers = async function (pageNo: number, limit: number, searchVal: string, token: string) {
    const response = await fetch(`${AUDIT_BASE_URL}/user/users?page=${pageNo}&limit=${limit}&filter=${searchVal}`, {
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

export const createUser = async function (email: string, isAdmin: boolean, token: string) {
    const response = await fetch(`${AUDIT_BASE_URL}/user/createUser`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, isAdmin })
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.errors[0].msg);
    }
    return result;
}

export const updateUser = async function (email: string, isAdmin: boolean, token: string) {
    const response = await fetch(`${AUDIT_BASE_URL}/user/updateUser`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, isAdmin })
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.errors[0].msg);
    }
    return result;
}

export const deleteUser = async function (email: string, token: string) {
    const response = await fetch(`${AUDIT_BASE_URL}/user/deleteUser`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email })
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.errors[0].msg);
    }
    return result;
}