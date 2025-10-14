import CryptoJS from "crypto-js";


export function SlugifyProductName(str: string) {
    const slug = str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    
    const hash = CryptoJS.MD5(str).toString(CryptoJS.enc.Hex).slice(0, 6);

    return `${hash}-${slug}`;
}