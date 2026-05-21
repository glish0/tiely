import { VerifyTicketClient } from "@/components/VerifyTicketClient";


type PageProps = {
    params: Promise<{
        token: string;
    }>;
};

export default async function VerifyTicketPage({ params }: PageProps) {
    const { token } = await params;
    console.log('TOKEN', token)
    return <VerifyTicketClient token={token} />;
}