import { searchByName } from "@/lib/user";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
  const response = await searchByName(params.name);

  return Response.json({ success: response.success, users: response.users || [] });
}
