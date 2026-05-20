import { VerifyTicketClient } from "@/components/VerifyTicketClient";


type PageProps = {
    params: {
        token: string;
    };
};

export default function VerifyTicketPage({ params }: PageProps) {
    return <VerifyTicketClient token={params.token} />;
}