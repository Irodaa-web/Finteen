import { NextResponse } from "next/server";
import db from "@/lib/db";
import { current, noStoreHeaders } from "@/lib/auth";
import Task from "@/models/Task";
import User from "@/models/User";

export async function POST(req, { params }) {
  await db();
  const auth = await current();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStoreHeaders });
  const user = await User.findById(auth.id).select("role familyId").lean();
  if (!user || user.role !== "child") return NextResponse.json({ error: "Faqat farzand vazifani topshira oladi" }, { status: 403, headers: noStoreHeaders });

  const { answer = "" } = await req.json();
  const { id } = await params;
  const task = await Task.findOne({ _id: id, familyId: user.familyId });
  if (!task) return NextResponse.json({ error: "Vazifa topilmadi" }, { status: 404, headers: noStoreHeaders });
  if (task.status !== "active") return NextResponse.json({ error: "Bu vazifa allaqachon topshirilgan" }, { status: 409, headers: noStoreHeaders });

  if (task.quizQuestion && String(answer).trim().toLowerCase() !== String(task.quizAnswer || "").trim().toLowerCase()) {
    return NextResponse.json({ error: "Test javobi noto‘g‘ri" }, { status: 400, headers: noStoreHeaders });
  }

  task.status = "submitted";
  task.submittedBy = user._id;
  task.quizScore = task.quizQuestion ? 100 : 0;
  task.submittedAt = new Date();
  await task.save();
  return NextResponse.json({ ok: true, task }, { headers: noStoreHeaders });
}
