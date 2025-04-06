import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const codeReviews = pgTable("code_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  code: text("code").notNull(),
  language: text("language").notNull(),
  createdAt: text("created_at").notNull(),
  securityAnalysis: boolean("security_analysis").notNull().default(true),
  performanceOptimization: boolean("performance_optimization").notNull().default(true),
  codingStandards: boolean("coding_standards").notNull().default(true),
  documentationQuality: boolean("documentation_quality").notNull().default(false),
  improvementSuggestions: boolean("improvement_suggestions").notNull().default(true),
  analysisDepth: integer("analysis_depth").notNull().default(3),
});

export const codeReviewResults = pgTable("code_review_results", {
  id: serial("id").primaryKey(),
  codeReviewId: integer("code_review_id").references(() => codeReviews.id).notNull(),
  overallQuality: text("overall_quality").notNull(),
  issues: jsonb("issues").notNull(),
  suggestions: jsonb("suggestions").notNull(),
  codeEfficiency: integer("code_efficiency").notNull(),
  bestPractices: integer("best_practices").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCodeReviewSchema = createInsertSchema(codeReviews).pick({
  userId: true,
  code: true,
  language: true,
  createdAt: true,
  securityAnalysis: true,
  performanceOptimization: true,
  codingStandards: true,
  documentationQuality: true,
  improvementSuggestions: true,
  analysisDepth: true,
});

export const insertCodeReviewResultSchema = createInsertSchema(codeReviewResults).pick({
  codeReviewId: true,
  overallQuality: true,
  issues: true,
  suggestions: true,
  codeEfficiency: true,
  bestPractices: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type CodeReview = typeof codeReviews.$inferSelect;
export type InsertCodeReview = z.infer<typeof insertCodeReviewSchema>;

export type CodeReviewResult = typeof codeReviewResults.$inferSelect;
export type InsertCodeReviewResult = z.infer<typeof insertCodeReviewResultSchema>;

export interface Issue {
  id: string;
  type: 'error' | 'warning' | 'suggestion';
  title: string;
  description: string;
  lineStart: number;
  lineEnd: number;
  code: string;
  suggestionCode: string;
  explanation: string;
}

export interface AnalysisResult {
  overallQuality: 'Excellent' | 'Good' | 'Average' | 'Poor';
  overallScore: number; // 1-5
  issuesCount: number;
  codeEfficiency: number; // percentage 0-100
  bestPractices: number; // percentage 0-100
  issues: Issue[];
}
