import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const userMessage = body.message || "";

  // ส่งข้อมูลจำลอง (Mock Data) ตามสัญญา API ที่ตกลงกันไว้
  return NextResponse.json({
    answer: `นี่คือข้อมูลการค้นคว้าจำลองสำหรับหัวข้อ: "${userMessage}" ระบบกำลังเชื่อมโยงข้อมูลสิ่งแวดล้อมและประเมินผลกระทบเชิงบวกให้คุณ`,
    citations: [
      {
        id: "1",
        title: "รายงานการฟื้นฟูสิ่งแวดล้อม 2026",
        url: "https://example.com/regenerative-report-2026",
      },
      {
        id: "2",
        title: "มาตรฐานคาร์บอนเครดิตสากล",
        url: "https://example.com/carbon-standard",
      },
    ],
    confidenceScore: 0.95,
  });
}