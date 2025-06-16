// app/api/messages/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { connectMongo } from "../../../lib/mong"; // Adjust the import path as needed
import { Message } from "../../../models/Message"; // Adjust the import path as needed

const apiKey = process.env.NEXT_PUBLIC__GEMINI_API;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  await connectMongo();
  const { text } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // ✅ use latest model
    const result = await model.generateContent([text]);
    const aiResponse = await result.response.text();

    const userMsg = await Message.create({ text, sender: "user" });
    const aiMsg = await Message.create({ text: aiResponse, sender: "ai" });

    return NextResponse.json({ user: userMsg, ai: aiMsg });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: "Gemini API error" }, { status: 500 });
  }
}
