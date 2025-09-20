import { AUDIT_BASE_URL } from "@/config";

export const getDashboardCount = async (token:string) => {
    const response = await fetch(`${AUDIT_BASE_URL}/audit/dashboard`, {
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