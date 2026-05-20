"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/contexts/AuthContexte";

const registerSchema = z.object({
  fullName: z.string().min(2, "Nom complet requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string(),
  password: z.string().min(6, "6 caractères minimum"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName, data.telephone);
    if (error) {
      toast.error("Erreur", { description: error.message });
      setIsLoading(false);
    } else {
      setRegisteredEmail(data.email);
      setIsRegistered(true);
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <Card className="glass w-full max-w-md border-gold/20 shadow-gold">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
            <Mail className="h-6 w-6 text-gold" />
          </div>
          <CardTitle className="text-2xl font-serif">Vérifiez votre email</CardTitle>
          <CardDescription className="text-foreground/70">
            Un email de confirmation a été envoyé à <strong>{registeredEmail}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Alert className="bg-gold/10 border-gold/20">
            <AlertDescription className="text-sm">
              Cliquez sur le lien dans l’email pour activer votre compte. Après confirmation, vous pourrez vous connecter.
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            className="w-full border-gold/30 text-gold hover:bg-gold/10"
            onClick={() => router.push("/login")}
          >
            Aller à la page de connexion
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-foreground/50">
            Vous n’avez pas reçu l’email ? Vérifiez vos spams ou{" "}
            <button
              className="text-gold hover:underline"
              onClick={() => onSubmit({ email: registeredEmail, password: "", confirmPassword: "", fullName: "" , telephone: ""} )}
            >
              renvoyer
            </button>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="glass w-full max-w-md border-gold/20 shadow-gold">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-serif">
          <span className="text-gradient-gold">Tiely</span>
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Créez votre espace mariage
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* ... mêmes champs que précédemment ... */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              placeholder="Sophie Dubois"
              className="bg-surface border-gold/20 focus:ring-gold"
              {...register("fullName")}
            />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="sophie@exemple.com"
              className="bg-surface border-gold/20 focus:ring-gold"
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
             <div className="space-y-2">
            <Label htmlFor="telephone">Telephone</Label>
            <Input
              id="telephone"
              
              placeholder="+237 **"
              className="bg-surface border-gold/20 focus:ring-gold"
              {...register("telephone")}
            />
            {errors.telephone && <p className="text-sm text-destructive">{errors.telephone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="bg-surface border-gold/20 focus:ring-gold pr-10"
                {...register("password")}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="bg-surface border-gold/20 focus:ring-gold pr-10"
                {...register("confirmPassword")}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full bg-gradient-gold hover:opacity-90 text-black font-semibold" disabled={isLoading}>
            {isLoading ? "Inscription..." : <><UserPlus className="mr-2 h-4 w-4" /> Créer mon compte</>}
          </Button>
          <p className="text-sm text-center text-foreground/70">
            Déjà inscrit ? <Link href="/login" className="text-gold hover:underline">Se connecter</Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}