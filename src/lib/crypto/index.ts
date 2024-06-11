import NextCrypto from "next-crypto";

const encryptionToken = process.env.ENCRYPTION_TOKEN;

const crypto = new NextCrypto(encryptionToken || "secret key");

export const encrypt = async <T>(data: T) => {
	return crypto.encrypt(JSON.stringify(data));
};

export const decrypt = async <T>(data: string) => {
	const decrypted = await crypto.decrypt(data);
	if (!decrypted) throw new Error("Decryption failed");
	return JSON.parse(decrypted) as T;
};
