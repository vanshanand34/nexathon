import { NextRequest, NextResponse } from 'next/server';
import { CodeReviewRequest } from '../code-review/route';
import { getAIReview } from '../code-review/route';



// app/api/code-suggestions/route.ts
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
      const body = (await request.json()) as CodeReviewRequest;
  
      if (!body.code || !body.language) {
        return NextResponse.json(
          { error: "Missing required fields: code and language" },
          { status: 400 }
        );
      }
  
      const reviewResult = await getAIReview(body.code, body.language, body.description ?? "No description provided");
  
      return NextResponse.json({
        success: true,
        data: {
          suggestions: reviewResult.suggestions,
          refactoredCode: reviewResult.refactoredCode,
        },
      });
    } catch (error: unknown) {
      return NextResponse.json(
        { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  }
  