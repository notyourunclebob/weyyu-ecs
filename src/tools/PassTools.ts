// test passwords can be generated at https://bcrypt-generator.com/
import bcrypt from "bcryptjs";

/** 
 * Number of salt rounds to generate hash code (12 recomended).
*/
const SALT_ROUNDS = 12;

/** 
 * Returns a hash code by salting the provided password.
 * Bcrypt embeds the salt code in the hash so only the hash needs to be saved.
 * @param password the password used to generate hash.
 * @returns Salt and hash for a password
 * @author James Wilson
*/
export async function hashPass(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
}

/** 
 * Verifies provided password by comparing it to the hash code and returns true if valid.
 * @param password Password to compare to the hashed password.
 * @param hashedPass Saved hashed password to compare with.
 * @returns True if a password is verified
 * @author James Wilson
*/
export async function verifyPass(password: string, hashedPass: string): Promise<boolean> {
    const isVerified = await bcrypt.compare(password, hashedPass);
    return isVerified;
}