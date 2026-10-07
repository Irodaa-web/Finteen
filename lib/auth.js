import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const secret = () => process.env.JWT_SECRET || "finteen-dev-secret";

export function sign(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, familyId: user.familyId?.toString() },
    secret(),
    { expiresIn: "7d" }
  );
}

export async function current() {
  try {
    const store = await cookies();
    const token = store.get("finteen_token")?.value;
    if (!token) return null;
    return jwt.verify(token, secret());
  } catch {
    return null;
  }
}

export const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};
