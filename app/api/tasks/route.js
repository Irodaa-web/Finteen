import { NextResponse } from "next/server";
import db from "@/lib/db";
import { current, noStoreHeaders } from "@/lib/auth";
import Task from "@/models/Task";
import User from "@/models/User";

export const dynamic = "force-dynamic";

async function liveAuth() {
  const auth = await current();
  if (!auth) return null;
  return User.findById(auth.id).select("role familyId").lean();
}

export async function GET() {
  await db();
  const user = await liveAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStoreHeaders });
  const tasks = await Task.find({ familyId: user.familyId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json(tasks, { headers: noStoreHeaders });
}

export async function POST(req) {
  await db();
  const user = await liveAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStoreHeaders });
  if (user.role !== "parent") return NextResponse.json({ error: "Faqat ota-ona vazifa yarata oladi" }, { status: 403, headers: noStoreHeaders });

  const body = await req.json();
  const reward = Number(body.reward);
  if (!body.title?.trim() || !["xp", "money"].includes(body.type) || !Number.isFinite(reward) || reward < 1) {
    return NextResponse.json({ error: "Vazifa ma’lumotlarini to‘g‘ri kiriting" }, { status: 400, headers: noStoreHeaders });
  }

  const task = await Task.create({
    familyId: user.familyId,
    title: body.title.trim(),
    description: body.description?.trim() || "",
    type: body.type,
    reward,
    quizQuestion: body.quizQuestion?.trim() || "",
    quizAnswer: body.quizAnswer?.trim() || "",
  });
  return NextResponse.json(task, { status: 201, headers: noStoreHeaders });
}
