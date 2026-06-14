import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();
    if (!domain) return NextResponse.json({ error: "Please provide a domain name." }, { status: 400 });

    const clean = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(clean)}`);

    if (!res.ok) return NextResponse.json({ error: `No WHOIS data found for ${clean}` }, { status: 404 });
    const data = await res.json();

    const lines: string[] = [`Domain: ${data.ldhName || clean}`];
    if (data.status?.length) lines.push(`Status: ${data.status.join(", ")}`);
    if (data.events) {
      for (const ev of data.events) {
        if (ev.eventAction === "registration") lines.push(`Registered: ${ev.eventDate?.slice(0, 10)}`);
        if (ev.eventAction === "expiration") lines.push(`Expires: ${ev.eventDate?.slice(0, 10)}`);
        if (ev.eventAction === "last changed") lines.push(`Updated: ${ev.eventDate?.slice(0, 10)}`);
      }
    }
    if (data.nameservers?.length) {
      lines.push(`Nameservers: ${data.nameservers.map((n: { ldhName: string }) => n.ldhName).join(", ")}`);
    }
    if (data.entities) {
      for (const entity of data.entities) {
        const roles = entity.roles?.join(", ") || "";
        const name = entity.vcardArray?.[1]?.find((v: string[]) => v[0] === "fn")?.[3] || "";
        if (name) lines.push(`${roles}: ${name}`);
      }
    }

    return NextResponse.json({ result: lines.join("\n") });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Lookup failed" }, { status: 500 });
  }
}
