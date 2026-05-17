/**
 * Compliance mutations — admin-only CRUD for controls, evidence, risks,
 * assets, RoPA. All gated by requireAdmin().
 */
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../auth";

const ISO = () => new Date().toISOString();

export const updateControlStatus = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("compliance_controls"),
    status: v.string(),
    notes: v.optional(v.string()),
    owner: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const patch: Record<string, unknown> = {
      status: args.status,
      updated_at: ISO(),
      last_reviewed_at: ISO(),
    };
    if (args.notes !== undefined) patch.notes = args.notes;
    if (args.owner !== undefined) patch.owner = args.owner;
    await ctx.db.patch(args.id, patch);
    return { ok: true };
  },
});

export const addEvidence = mutation({
  args: {
    adminToken: v.string(),
    control_ref: v.string(),
    framework: v.string(),
    title: v.string(),
    summary: v.string(),
    link: v.optional(v.string()),
    status: v.optional(v.string()),
    valid_until: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const now = ISO();
    const id = await ctx.db.insert("compliance_evidence", {
      control_ref: args.control_ref,
      framework: args.framework,
      source: "manual",
      collector: null,
      title: args.title,
      summary: args.summary,
      payload_json: "{}",
      link: args.link ?? null,
      status: args.status ?? "pass",
      valid_from: now,
      valid_until: args.valid_until ?? null,
      collected_at: now,
      collected_by: "admin",
    });
    return { id };
  },
});

export const deleteEvidence = mutation({
  args: { adminToken: v.string(), id: v.id("compliance_evidence") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

export const upsertRisk = mutation({
  args: {
    adminToken: v.string(),
    id: v.optional(v.id("compliance_risks")),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    likelihood: v.string(),
    impact: v.string(),
    inherent_score: v.number(),
    treatment: v.string(),
    residual_score: v.number(),
    mitigations_json: v.string(),
    owner: v.string(),
    status: v.string(),
    next_review_at: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const now = ISO();
    const { adminToken: _t, id, ...fields } = args;
    if (id) {
      await ctx.db.patch(id, {
        ...fields,
        next_review_at: args.next_review_at ?? null,
        updated_at: now,
      });
      return { id };
    }
    const newId = await ctx.db.insert("compliance_risks", {
      ...fields,
      next_review_at: args.next_review_at ?? null,
      created_at: now,
      updated_at: now,
    });
    return { id: newId };
  },
});

export const deleteRisk = mutation({
  args: { adminToken: v.string(), id: v.id("compliance_risks") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

export const upsertAsset = mutation({
  args: {
    adminToken: v.string(),
    id: v.optional(v.id("compliance_assets")),
    kind: v.string(),
    name: v.string(),
    description: v.string(),
    owner: v.string(),
    classification: v.string(),
    location: v.string(),
    processor_dpa_url: v.optional(v.string()),
    linked_controls_json: v.string(),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const now = ISO();
    const { adminToken: _t, id, ...fields } = args;
    if (id) {
      await ctx.db.patch(id, {
        ...fields,
        processor_dpa_url: args.processor_dpa_url ?? null,
        updated_at: now,
      });
      return { id };
    }
    const newId = await ctx.db.insert("compliance_assets", {
      ...fields,
      processor_dpa_url: args.processor_dpa_url ?? null,
      created_at: now,
      updated_at: now,
    });
    return { id: newId };
  },
});

export const deleteAsset = mutation({
  args: { adminToken: v.string(), id: v.id("compliance_assets") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

export const upsertProcessingActivity = mutation({
  args: {
    adminToken: v.string(),
    id: v.optional(v.id("processing_activities")),
    name: v.string(),
    purpose: v.string(),
    lawful_basis: v.string(),
    data_categories_json: v.string(),
    data_subject_categories_json: v.string(),
    recipients_json: v.string(),
    transfers_outside_eea_json: v.string(),
    retention_period: v.string(),
    security_measures: v.string(),
    controller: v.string(),
    processor: v.optional(v.string()),
    dpia_required: v.boolean(),
    dpia_link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const now = ISO();
    const { adminToken: _t, id, ...fields } = args;
    if (id) {
      await ctx.db.patch(id, {
        ...fields,
        processor: args.processor ?? null,
        dpia_link: args.dpia_link ?? null,
        updated_at: now,
      });
      return { id };
    }
    const newId = await ctx.db.insert("processing_activities", {
      ...fields,
      processor: args.processor ?? null,
      dpia_link: args.dpia_link ?? null,
      created_at: now,
      updated_at: now,
    });
    return { id: newId };
  },
});

export const deleteProcessingActivity = mutation({
  args: { adminToken: v.string(), id: v.id("processing_activities") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});
