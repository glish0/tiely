"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";

interface AccessCodeModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AccessCodeModal({
    open,
    onClose,
    onSuccess,
}: AccessCodeModalProps) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!open) return null;

    async function handleSubmit() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/check-access-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setCode("");
            onClose();
            onSuccess();
        } catch {
            setError("Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-slate-900 p-6 border border-white/10">

                <div className="flex justify-center">
                    <div className="rounded-full bg-green-500/20 p-3">
                        <Lock className="h-7 w-7 text-green-400" />
                    </div>
                </div>

                <h2 className="mt-4 text-center text-xl font-bold text-white">
                    Autorisation requise
                </h2>

                <p className="mt-2 text-center text-slate-400">
                    Veuillez saisir le code d'accès.
                </p>

                <input
                    type="password"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="mt-6 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none"
                    placeholder="********"
                />

                {error && (
                    <p className="mt-2 text-sm text-red-400">
                        {error}
                    </p>
                )}

                <div className="mt-6 flex gap-3">

                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-slate-700 py-3 text-white"
                    >
                        Annuler
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white"
                    >
                        {loading ? (
                            <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                        ) : (
                            "Valider"
                        )}
                    </button>

                </div>

            </div>
        </div>
    );
}