import { 
  users, 
  codeReviews, 
  codeReviewResults, 
  type User, 
  type InsertUser, 
  type CodeReview, 
  type InsertCodeReview,
  type CodeReviewResult,
  type InsertCodeReviewResult
} from "@shared/schema";

// Storage interface
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Code review methods
  createCodeReview(review: InsertCodeReview): Promise<CodeReview>;
  getCodeReview(id: number): Promise<CodeReview | undefined>;
  getCodeReviewsByUserId(userId: number): Promise<CodeReview[]>;
  
  // Code review results methods
  createCodeReviewResult(result: InsertCodeReviewResult): Promise<CodeReviewResult>;
  getCodeReviewResult(id: number): Promise<CodeReviewResult | undefined>;
  getCodeReviewResultByReviewId(reviewId: number): Promise<CodeReviewResult | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private codeReviews: Map<number, CodeReview>;
  private codeReviewResults: Map<number, CodeReviewResult>;
  private userIdCounter: number;
  private codeReviewIdCounter: number;
  private codeReviewResultIdCounter: number;

  constructor() {
    this.users = new Map();
    this.codeReviews = new Map();
    this.codeReviewResults = new Map();
    this.userIdCounter = 1;
    this.codeReviewIdCounter = 1;
    this.codeReviewResultIdCounter = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async createCodeReview(review: InsertCodeReview): Promise<CodeReview> {
    const id = this.codeReviewIdCounter++;
    const newReview: CodeReview = { ...review, id };
    this.codeReviews.set(id, newReview);
    return newReview;
  }

  async getCodeReview(id: number): Promise<CodeReview | undefined> {
    return this.codeReviews.get(id);
  }

  async getCodeReviewsByUserId(userId: number): Promise<CodeReview[]> {
    return Array.from(this.codeReviews.values()).filter(
      (review) => review.userId === userId,
    );
  }

  async createCodeReviewResult(result: InsertCodeReviewResult): Promise<CodeReviewResult> {
    const id = this.codeReviewResultIdCounter++;
    const newResult: CodeReviewResult = { ...result, id };
    this.codeReviewResults.set(id, newResult);
    return newResult;
  }

  async getCodeReviewResult(id: number): Promise<CodeReviewResult | undefined> {
    return this.codeReviewResults.get(id);
  }

  async getCodeReviewResultByReviewId(reviewId: number): Promise<CodeReviewResult | undefined> {
    return Array.from(this.codeReviewResults.values()).find(
      (result) => result.codeReviewId === reviewId,
    );
  }
}

export const storage = new MemStorage();
