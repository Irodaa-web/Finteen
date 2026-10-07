import { NextResponse } from "next/server";
import db from "@/lib/db";
import { current, noStoreHeaders } from "@/lib/auth";
import User from "@/models/User";
import Family from "@/models/Family";

export const dynamic = "force-dynamic";

export async function GET() {
  await db();
  const auth = await current();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStoreHeaders });

  const user = await User.findById(auth.id).select("-password").lean();
  if (!user) return NextResponse.json({ error: "User topilmadi" }, { status: 404, headers: noStoreHeaders });

  const family = user.familyId ? await Family.findById(user.familyId).lean() : null;
  return NextResponse.json({ user, family }, { headers: noStoreHeaders });
}
