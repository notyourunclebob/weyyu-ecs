import bcrypt from "bcrypt";

/** 
 * Number of salt rounds to generate hash code (12 recomended).
*/
const SALT_ROUNDS = 12;

/** 
 * Returns a hash code by salting the provided password.
 * Bcrypt embeds the salt code in the hash so only the hash needs to be saved.
 * @param password the password usee to generate hash.
*/
export async function hashPW(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
}

/** 
 * Verifies provided password by comparing it to the hash code and returns true if valid.
 * @param password Password to compare to the hash.
 * @param hashedPW Saved hash code to compare with.
*/
export async function verifyPW(password:string, hashedPW:string): Promise<boolean> {
    const isVerified = await bcrypt.compare(password, hashedPW);
    return isVerified;
}