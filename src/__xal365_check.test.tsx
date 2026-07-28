import { describe, expect, it } from "vitest";
import { render } from "../src/entry-server";
import { getPostBySlug } from "@/lib/postContent";

describe("XAL-365 verify", () => {
  it("renders exactly one h1 for the kommune comparison post", async () => {
    const slug = "bookingsoftware-kommune-sammenligning-pris";
    const post = getPostBySlug(slug);
    expect(post).toBeDefined();
    const route = `/blogg/${slug}`;
    const html = await render(route);
    const h1s = html.match(/<h1[ >]/g) ?? [];
    console.log("H1 COUNT:", h1s.length, "TITLE MATCH:", html.includes(`>${post.title}<`));
    expect(h1s.length).toBe(1);
  });
});
