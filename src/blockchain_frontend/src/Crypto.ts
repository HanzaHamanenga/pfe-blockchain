export const toUnit8Array = (data: number[]): Uint8Array => new Uint8Array(data);
export const toNumberArray = (data: Uint8Array): number[] => Array.from(data);

export const generateNumber = async (): Promise<number[]> => {
    const Randnumber = crypto.getRandomValues(new Uint8Array(32));
    return toNumberArray(Randnumber);
};

export const sha256 = async (data: number[]): Promise<number[]> => {
    const hashBuffer = await crypto.subtle.digest("SHA-256", toUnit8Array(data));
    return toNumberArray(new Uint8Array(hashBuffer));
};

export const hashPassword = async (
    password: string,
    Randnumber: number[],
    iterations: number = 210_000,
    keyLength: number = 32
): Promise<number[]> => {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
    );

    const deriveBits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: toUnit8Array(Randnumber),
            iterations,
            hash: "SHA-256",
        },
        keyMaterial,
        keyLength * 8 
    );

    return toNumberArray(new Uint8Array(deriveBits));
};
