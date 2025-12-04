export function IsSameSite(headers_origin: any) {
    const origin = headers_origin || "";
    return origin.includes("localhost");
}