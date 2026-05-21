"use client";

import { useCheckInTicket, useVerifyTicket } from "@/hooks/useTicketVerification";
import {
    AlertTriangle,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    Ticket,
    UserCheck,
    XCircle,
} from "lucide-react";



type VerifyTicketClientProps = {
    token: string;
};

export function VerifyTicketClient({ token }: VerifyTicketClientProps) {
    const {
        data: ticket,
        isLoading,
        isError,
    } = useVerifyTicket(token);

    const checkInMutation = useCheckInTicket(token);
    console.log('VERIFY TICKET', ticket)
    console.log('CHECK MUTATION', checkInMutation)

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <p>Vérification du billet...</p>
                </div>
            </main>
        );
    }

    if (isError || !ticket) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
                <div className="max-w-md rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
                    <XCircle className="mx-auto h-14 w-14 text-red-400" />
                    <h1 className="mt-4 text-2xl font-bold">Billet invalide</h1>
                    <p className="mt-2 text-sm text-red-100">
                        Ce QR Code ne correspond à aucun billet valide.
                    </p>
                </div>
            </main>
        );
    }

    const alreadyCheckedIn = Boolean(ticket.checked_in_at);
    const isConfirmed = ticket.rsvp_status === "confirmed";

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
            <section className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-950">
                        <ShieldCheck className="h-8 w-8" />
                    </div>

                    <p className="mt-5 text-sm uppercase tracking-[0.3em] text-slate-300">
                        Contrôle billet
                    </p>

                    <h1 className="mt-3 text-3xl font-bold">
                        {ticket.name}
                    </h1>
                </div>

                <div className="mt-8 grid gap-4">
                    <InfoCard
                        label="Nombre de places"
                        value={`${ticket.max_guests}`}
                    />

                    <InfoCard
                        label="Type d’invitation"
                        value={
                            ticket.group_type === "couple"
                                ? "Couple"
                                : "Individuelle"
                        }
                    />

                    <InfoCard
                        label="Table"
                        value={
                            ticket.table_number
                                ? `Table ${ticket.table_number}`
                                : "Non définie"
                        }
                    />
                </div>

                <div className="mt-6 space-y-3">
                    {isConfirmed ? (
                        <StatusCard
                            icon={<CheckCircle2 className="h-5 w-5" />}
                            title="Présence confirmée"
                            description="L’invité a confirmé sa présence."
                            className="border-green-500/30 bg-green-500/10 text-green-100"
                        />
                    ) : (
                        <StatusCard
                            icon={<AlertTriangle className="h-5 w-5" />}
                            title="Présence non confirmée"
                            description="L’invité n’a pas encore confirmé sa présence."
                            className="border-yellow-500/30 bg-yellow-500/10 text-yellow-100"
                        />
                    )}

                    {alreadyCheckedIn ? (
                        <StatusCard
                            icon={<XCircle className="h-5 w-5" />}
                            title="Billet déjà utilisé"
                            description={
                                ticket.checked_in_at
                                    ? `Entrée validée le ${new Date(
                                        ticket.checked_in_at
                                    ).toLocaleString("fr-FR")}`
                                    : "Ce billet a déjà été scanné."
                            }
                            className="border-red-500/30 bg-red-500/10 text-red-100"
                        />
                    ) : (
                        <StatusCard
                            icon={<Ticket className="h-5 w-5" />}
                            title="Billet non utilisé"
                            description="Ce billet peut encore être validé à l’entrée."
                            className="border-blue-500/30 bg-blue-500/10 text-blue-100"
                        />
                    )}
                </div>

                {!alreadyCheckedIn && (
                    <button
                        onClick={() => checkInMutation.mutate(ticket.id)}
                        disabled={checkInMutation.isPending}
                        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-4 font-bold text-white transition hover:bg-green-600 disabled:opacity-60"
                    >
                        {checkInMutation.isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <UserCheck className="h-5 w-5" />
                        )}
                        Valider l’entrée
                    </button>
                )}

                {checkInMutation.isError && (
                    <p className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-100">
                        {checkInMutation.error.message}
                    </p>
                )}
            </section>
        </main>
    );
}

function InfoCard({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-1 text-lg font-bold text-white">{value}</p>
        </div>
    );
}

function StatusCard({
    icon,
    title,
    description,
    className,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    className: string;
}) {
    return (
        <div className={`rounded-2xl border px-4 py-4 ${className}`}>
            <div className="flex gap-3">
                <div>{icon}</div>
                <div>
                    <p className="font-bold">{title}</p>
                    <p className="mt-1 text-sm opacity-80">{description}</p>
                </div>
            </div>
        </div>
    );
}