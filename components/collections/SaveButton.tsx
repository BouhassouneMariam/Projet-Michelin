"use client";

import {useState} from "react";
import {BookmarkPlus} from "lucide-react";
import {AddToCollectionModal} from "@/components/collections/AddToCollectionModal";
import {useAuth} from "@/features/users/AuthProvider";

export function SaveButton({
                               restaurantId,
                               onAuthRequired
                           }: {
    restaurantId: string;
    onAuthRequired?: () => void;
}) {
    const {isAuthenticated} = useAuth();
    const [collectionModalOpen, setCollectionModalOpen] = useState(false);

    function openCollectionModal() {
        if (!isAuthenticated) {
            onAuthRequired?.();
            return;
        }

        setCollectionModalOpen(true);
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <button
                type="button"
                onClick={openCollectionModal}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-rouge px-3 text-sm font-semibold text-white transition hover:bg-[#9d2626]"
            >
                <BookmarkPlus size={16}/>
                Save
            </button>

            <AddToCollectionModal
                restaurantId={restaurantId}
                open={collectionModalOpen}
                onClose={() => setCollectionModalOpen(false)}
            />
        </>
    );
}
