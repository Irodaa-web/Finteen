import { NextResponse } from "next/server";
import db from "@/lib/db";
import { current, noStoreHeaders } from "@/lib/auth";
import Task from "@/models/Task";
import User from "@/models/User";

export async function POST(req, { params }) {
  await db();
  const auth = await current();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStoreHeaders });
  const parent = await User.findById(auth.id).select("role familyId").lean();
  if (!parent || parent.role !== "parent") return NextResponse.json({ error: "Faqat ota-ona tasdiqlaydi" }, { status: 403, headers: noStoreHeaders });

  const { id } = await params;
  // Atomic status change prevents double-click/double reward.
  const task = await Task.findOneAndUpdate(
    { _id: id, familyId: parent.familyId, status: "submitted", rewardCredited: { $ne: true } },
    { $set: { status: "approved", rewardCredited: true, approvedAt: new Date() } },
    { new: true }
  );
  if (!task) return NextResponse.json({ error: "Vazifa allaqachon tasdiqlangan yoki topilmadi" }, { status: 409, headers: noStoreHeaders });

  const field = task.type === "xp" ? "xp" : "wallet";
  const child = await User.findOneAndUpdate(
    { _id: task.submittedBy, familyId: parent.familyId, role: "child" },
    { $inc: { [field]: Number(task.reward) } },
    { new: true, runValidators: true }
  ).select("-password");

  if (!child) {
    await Task.updateOne({ _id: task._id }, { $set: { status: "submitted", rewardCredited: false }, $unset: { approvedAt: 1 } });
    return NextResponse.json({ error: "Vazifani topshirgan farzand topilmadi" }, { status: 404, headers: noStoreHeaders });
  }

  return NextResponse.json({ ok: true, task, child }, { headers: noStoreHeaders });
}
