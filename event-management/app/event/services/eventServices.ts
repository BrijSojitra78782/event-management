import { EVENT_BASE_URL } from "@/config";

export const getEvents = async function ( searchVal: string, token: string) {
    const response = await fetch(`${EVENT_BASE_URL}/event/events?filter=${searchVal}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.errors[0].msg)
        }
        console.log(result);
        return result;
};

export const createEvents = async function (formData: any, token: string) {
    const response = await fetch(`${EVENT_BASE_URL}/event/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.errors[0].msg)
        }
        console.log(result);
        return result;
};

export const fileUpload = async function (file: any, token: string) {
    try {
        const formData = new FormData();
        formData.append('file', file as any);
        const response = await fetch(`${EVENT_BASE_URL}/event/uploadfile`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        const result = await response.json();
        if (response.ok) {
            alert('Success: ' + result);
        }
        else
        {
            alert('Upload failed: ' + result);
        }
        return result;
    } catch (error) {
        console.log(error);
        alert('Error uploading file: ' + error);
        throw error;
    }
};

export const sendQR = async function (token: string) {
    try {
        const response = await fetch(`${EVENT_BASE_URL}/event/sendqr`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.errors[0]?.msg || 'QR generation failed');
        }
        return result;
    } catch (error) {
        throw error;
    }
};

export const resendQR = async function (token: string) {
    try {
        const response = await fetch(`${EVENT_BASE_URL}/event/resendqr`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.errors[0]?.msg || 'QR generation failed');
        }
        return result;
    } catch (error) {
        throw error;
    }
};