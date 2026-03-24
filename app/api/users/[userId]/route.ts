export async function GET(
    req: Request,
    {params}: {params: {userId: string}}
){
    const { userId } =  await params;
    return Response.json({ userId });
}