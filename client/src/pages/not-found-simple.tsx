import { Card, CardContent, CardFooter } from "../components/simple-card";
import { AlertCircle, Home, Code } from "lucide-react";
import { Button } from "../components/simple-button";
import { Link } from "wouter";

export default function NotFoundSimple() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center mb-6">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">404 Page Not Found</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pb-6">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/code-review-simple">
              <Code className="mr-2 h-4 w-4" />
              Code Review
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}