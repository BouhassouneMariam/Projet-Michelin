"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { UserProfileDto } from "@/features/users/user.service";
import { Camera, X } from "lucide-react";

interface EditProfileModalProps {
  profile: UserProfileDto;
  onClose: () => void;
  onSuccess: (profile: UserProfileDto) => void;
}

export function EditProfileModal({ profile, onClose, onSuccess }: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: profile.name,
    username: profile.username,
    bio: profile.bio || "",
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        setError("Le fichier doit être une image");
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Le fichier est trop volumineux (max 5MB)");
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Créer une URL de prévisualisation
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeAvatar = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // D'abord uploader l'avatar si un fichier est sélectionné
      if (selectedFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", selectedFile);

        const avatarResponse = await fetch("/api/users/avatar", {
          method: "POST",
          body: avatarFormData,
        });

        if (!avatarResponse.ok) {
          const data = await avatarResponse.json();
          throw new Error(data.error || "Erreur lors de l'upload de l'avatar");
        }
      }

      // Ensuite mettre à jour les autres informations
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          // Ne pas envoyer avatarUrl si on a uploadé un fichier (c'est déjà fait)
          avatarUrl: selectedFile ? undefined : (previewUrl || null),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la mise à jour du profil");
      }

      const updated = await response.json();
      onSuccess(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-2xl font-medium text-ink">Modifier mon profil</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Photo de profil</label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rouge to-pink-500 overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                >
                  <Camera size={16} />
                  Choisir une photo
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, max 5MB
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rouge"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink">
              Nom d&apos;utilisateur
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rouge"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink">Biographie</label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rouge"
              rows={3}
              placeholder="Parlez-nous de vous..."
            />
          </div>

          {error && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded border border-gray-300 px-4 py-2 font-medium text-ink hover:bg-gray-50"
            >
              Annuler
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
