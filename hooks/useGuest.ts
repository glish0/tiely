import {
  createGuestGroupWithGuests,
  getGuestGroupsForCurrentUser,
  getGuestsForCurrentUser,
  getUserWeddingOptions,
  markAllInvitationsAsSent,
  markInvitationAsSent,
} from "@/lib/actions/guestService";
import { ICreateGuestGroup, InvitationChannel } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


const useCreateGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateGuestGroup) => {
      const promise = createGuestGroupWithGuests(data);

      // 🔥 toast loading + auto success/error
      toast.promise(promise, {
        loading: "Création de l'invité...",
        success: "Invité créé avec succès 🎉",
        error: (err) => err.message || "Une erreur est survenue",
      });

      return promise;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["guest-groups"],
      });
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
};

const useGetGuestsForCurrentUser = () => {

  return useQuery({
    queryKey: ["guests"],
    queryFn: () => getGuestsForCurrentUser(),
  });
};

const useGetGuestsGroupForCurrentUser = () => {

  return useQuery({
    queryKey: ["guest-groups"],
    queryFn:  getGuestGroupsForCurrentUser,
  });
};

const useGetUserWedding = () => {

  return useQuery({
    queryKey: ["weddings"],
    queryFn: () => getUserWeddingOptions,
  });
};



const useMarkInvitationSent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invitationId,
      channel = "manual",
    }: {
      invitationId: string;
      channel?: InvitationChannel;
    }) => markInvitationAsSent({ invitationId, channel }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest-groups"] });
    },
  });
};

const useMarkAllInvitationsSent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channel = "manual" }: { channel?: InvitationChannel } = {}) =>
      markAllInvitationsAsSent({ channel }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest-groups"] });
    },
  });
};


export {
 useCreateGuest,
 useGetUserWedding,
 useGetGuestsGroupForCurrentUser,
 useGetGuestsForCurrentUser,
 useMarkAllInvitationsSent,
 useMarkInvitationSent
}
