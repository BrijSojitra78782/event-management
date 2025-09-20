import { AUDIT_BASE_URL } from "@/config";
import { AuditStatus } from "@/constants/Types";
import { Buffer } from "buffer";

export const getAudits = async function (pageNo: number, limit: number, searchVal: string, token: string) {
    const response = await fetch(`${AUDIT_BASE_URL}/audit/audits?page=${pageNo}&limit=${limit}&filter=${searchVal}`, {
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

export const getAuditSummary = async function (auditId: string, typeId: string, token: string) {

    const response = await fetch(`${AUDIT_BASE_URL}/audit/${auditId}/summary/${typeId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.errors[0].msg);
    }
    return result;
}

export const scanAsset = async function (auditId: string, assetId: string, status: string, token: string) {

    const response = await fetch(`${AUDIT_BASE_URL}/audit/${auditId}/asset/${assetId}`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify({ status })
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.errors[0].msg);
    }
    return result;
}

export const addAudit = async function (auditName: string, token: string) {

    const response = await fetch(`${AUDIT_BASE_URL}/audit/create`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify({ name: auditName })
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.errors[0].msg);
    }
    return result;
}


export const getRemainingAssets = async function (auditId: string, typeId: string, page: number, limit: number, token: string) {

    const response = await fetch(`${AUDIT_BASE_URL}/audit/${auditId}/${typeId}/remainingAsset?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.errors[0].msg);
    }
    return result;
}

export const updateAudit = async function (auditId: string | string[], status: AuditStatus, token: string) {
    const response = await fetch(`${AUDIT_BASE_URL}/audit/${auditId}/submit`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.errors[0].msg);
    }
    return result;
}

export const downloadReport = async function (auditId: string, token: string) {
    const response = await fetch(`${AUDIT_BASE_URL}/audit/${auditId}/report`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.errors[0].msg);
    }
    const blob = await response.arrayBuffer();
    return {
        'contentType': response.headers.get("content-type"),
        'fileName': response.headers.get("content-disposition").split('filename=')[1],
        'data': Buffer.from(blob, 'base64').toString('base64')
    }
}


export const getRemainingAssetsQr = async function (auditId: string, typeId: string, token: string) {

    const response = await fetch(`${AUDIT_BASE_URL}/audit/${auditId}/${typeId}/remainingAsset/generateQR`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.errors[0].msg);
    }
    return result;
}

export const validateAssetInAudit = async function (auditId:string, assetId:string,token:string) {
    const response = await fetch(`${AUDIT_BASE_URL}/audit/${auditId}/${assetId}/validate`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.errors[0].msg);
    }
    return result;
}