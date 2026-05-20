"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/contexts/AuthContexte";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Type pour l'erreur retournée par l'API
interface ApiErrorResponse {
  message?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithGoogle  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });





      const onSubmit = async (data: LoginFormValues) => {
      setIsLoading(true);
      const { error } = await signIn (data.email, data.password);
      if (error) {
        toast.error('Erreur', { description: error.message });
      } else {
        toast.success('Connexion réussi !', {
          description: 'Vous pouvez maintenant vous connecter.',
        });
      router.push('/board');
      }
      setIsLoading(false);
    };

  return (
    <Card className="glass w-full max-w-md border-gold/20 shadow-gold">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-serif">
          <span className="text-gradient-gold">Tiely</span>
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Connectez-vous à votre espace mariage
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nom@exemple.com"
              className="bg-surface border-gold/20 focus:ring-gold"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-surface border-gold/20 focus:ring-gold pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-gradient-gold hover:opacity-90 text-black font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : <><LogIn className="mr-2 h-4 w-4" /> Se connecter</>}
          </Button>

          <div className="flex items-center w-full">
              <div className="flex-1 h-px bg-yellow-500/20" />
              <span className="px-3 text-xs text-gray-400">OU</span>
              <div className="flex-1 h-px bg-yellow-500/20" />
            </div>

            {/* GOOGLE BUTTON */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-yellow-500/30 hover:bg-yellow-500/10"
              onClick={signInWithGoogle}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.35 11.1h-9.18v2.98h5.3c-.23 1.5-1.74 4.4-5.3 4.4-3.2 0-5.8-2.65-5.8-5.92s2.6-5.92 5.8-5.92c1.82 0 3.05.77 3.75 1.44l2.56-2.48C17.1 4.1 14.9 3 12.17 3 6.94 3 2.77 7.18 2.77 12.5S6.94 22 12.17 22c6.84 0 9.1-4.78 9.1-7.24 0-.49-.05-.86-.12-1.23Z"
                />
              </svg>
              Continuer avec Google
            </Button>


          <p className="text-sm text-center text-foreground/70">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-gold hover:underline font-medium">
              Créer un compte
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}