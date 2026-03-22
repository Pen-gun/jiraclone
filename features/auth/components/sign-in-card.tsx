import { DottedSeparator } from "@/components/dotted-seperator";
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle,
 } from "@/components/ui/card";
export const SignInCard = () => {
    return (
        <Card className="w-full h-full md:w-121.7 border-none shadow-none" >
            <CardHeader className="flex items-center justify-center pt-10">
                <CardTitle className="text-2xl font-bold text-center mb-4">
                    Welcome my friend
                </CardTitle>
            </CardHeader>
            <div className="px-7 mb-2">
                <DottedSeparator />
            </div>
        </Card>
    );
}