import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { connectMongo } from "../../../lib/mong";
import { Message } from "../../../models/Message";

const apiKey = process.env.GEMINI_API; 

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);


export async function POST(req: Request) {
  await connectMongo();

  try {
    const { text } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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


export async function GET() {
  await connectMongo();

  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
