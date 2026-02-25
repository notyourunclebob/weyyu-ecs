import { getClaimsAll } from "@/tools/ClaimManager";

export function GET() {
    return getClaimsAll();
}