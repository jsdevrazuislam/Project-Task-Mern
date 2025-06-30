import { Skeleton } from "../components/ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";

export function EventCardSkeleton() {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-36" />
                </div>

                <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-40" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                </div>

                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-9 w-24" />
                </div>
            </CardContent>
        </Card>
    );
}