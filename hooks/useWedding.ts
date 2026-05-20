import { getUserWeddingOptions } from "@/lib/actions/guestService";
import { createWedding, myWedding } from "@/lib/actions/weddingService";
import { CreateWeddingInput } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useCreateWedding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWeddingInput) => {
      const promise = createWedding(data);

      // 🔥 toast loading + auto success/error
      toast.promise(promise, {
        loading: "Création du mariage...",
        success: "Mariage créé avec succès 🎉",
        error: (err) => err.message || "Une erreur est survenue",
      });

      return promise;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["weddings"],
      });
    },
  });
};

const useWyWedding = (user_id?: string) => {

  return useQuery({
    queryKey: ["weddings", user_id],
    queryFn: () => myWedding(user_id),
    enabled: !!user_id
  });
};

const useWeddingOptions = () => {

  return useQuery({
    queryKey: ["user-weddings-options"],
    queryFn: () => getUserWeddingOptions(),

  });
};


export { useCreateWedding , useWyWedding, useWeddingOptions};