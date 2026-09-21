import { deliverLead, fieldErrors, permitSchema, referenceCode } from "@/lib/leads";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "The request could not be read." }, { status: 400 });
  }

  const parsed = permitSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, message: "Check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  const reference = referenceCode("PRM");
  await deliverLead("permit", reference, parsed.data);
  return Response.json({ ok: true, reference });
}
