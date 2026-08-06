import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  if (!pathSegments || pathSegments.length === 0) {
    return new NextResponse("Image path required", { status: 400 });
  }

  const decodedSegments = pathSegments.map((segment) => decodeURIComponent(segment));
  const filePath = path.join(process.cwd(), "content", ...decodedSegments);

  // Validação de segurança para evitar directory traversal
  const normalizedPath = path.normalize(filePath);
  const contentDir = path.normalize(path.join(process.cwd(), "content"));

  if (!normalizedPath.startsWith(contentDir) || !fs.existsSync(normalizedPath)) {
    return new NextResponse("Image not found", { status: 404 });
  }

  const stat = fs.statSync(normalizedPath);
  if (!stat.isFile()) {
    return new NextResponse("Not a file", { status: 400 });
  }

  const ext = path.extname(normalizedPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const fileBuffer = fs.readFileSync(normalizedPath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
