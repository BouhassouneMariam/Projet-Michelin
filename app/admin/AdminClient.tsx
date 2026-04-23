"use client";

import { useState, useMemo } from "react";
import { Trash2, Plus, Users, UtensilsCrossed, Pencil, Check, X, ChevronLeft, ChevronRight, Search, ArrowUpDown, BookOpen, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { deleteRestaurant, deleteUser, createRestaurant, updateRestaurant, updateUser, createQuestion, updateQuestion, deleteQuestion, createOption, updateOption, deleteOption } from "./actions";

const MapPicker = dynamic(() => import("@/components/admin/MapPicker").then(mod => mod.MapPicker), { 
  ssr: false,
  loading: () => <div className="h-48 w-full animate-pulse rounded-xl bg-porcelain" />
});

const PAGE_SIZE = 15;

export function AdminClient({ restaurants, users, initialQuestions }: { restaurants: any[], users: any[], initialQuestions: any[] }) {
  const [activeTab, setActiveTab] = useState<"restaurants" | "users" | "questionnaire">("restaurants");
  const [isAdding, setIsAdding] = useState(false);
  const [busy, setBusy] = useState(false);

  // Search and Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination states
  const [restPage, setRestPage] = useState(1);
  const [userPage, setUserPage] = useState(1);

  // Edit states
  const [editingRestId, setEditingRestId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  // Delete states
  const [deletingRestId, setDeletingRestId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
  const [deletingOptionId, setDeletingOptionId] = useState<string | null>(null);

  // Add Form states
  const [formData, setFormData] = useState<any>({
    name: "", city: "", description: "", budget: "MEDIUM", award: "SELECTED", cuisine: "", chefName: "", imageUrl: "",
    key: "", label: "", question: "", intro: "", order: 0
  });

  const [newOptionData, setNewOptionData] = useState<any>({ label: "", value: "", description: "", iconName: "Sparkles" });

  function handleTabChange(tab: "restaurants" | "users" | "questionnaire") {
    setActiveTab(tab);
    setSearchQuery("");
    setSortColumn(tab === "questionnaire" ? "order" : "name");
    setSortDirection("asc");
    setRestPage(1);
    setUserPage(1);
    setIsAdding(false);
  }

  function handleSort(column: string) {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }

  // --- RESTAURANTS LOGIC ---
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((r) => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.award.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        let aVal = a[sortColumn] || "";
        let bVal = b[sortColumn] || "";
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [restaurants, searchQuery, sortColumn, sortDirection]);

  const paginatedRestaurants = useMemo(() => 
    filteredRestaurants.slice((restPage - 1) * PAGE_SIZE, restPage * PAGE_SIZE), 
  [filteredRestaurants, restPage]);
  
  const totalRestPages = Math.max(1, Math.ceil(filteredRestaurants.length / PAGE_SIZE));

  // --- USERS LOGIC ---
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        let aVal = sortColumn === "createdAt" ? new Date(a.createdAt).getTime() : (a[sortColumn] || "");
        let bVal = sortColumn === "createdAt" ? new Date(b.createdAt).getTime() : (b[sortColumn] || "");
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [users, searchQuery, sortColumn, sortDirection]);

  const paginatedUsers = useMemo(() => 
    filteredUsers.slice((userPage - 1) * PAGE_SIZE, userPage * PAGE_SIZE), 
  [filteredUsers, userPage]);
  
  const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  // --- ACTIONS ---
  async function handleAddRestaurant(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await createRestaurant(formData);
      setIsAdding(false);
      setFormData({ name: "", city: "", description: "", budget: "MEDIUM", award: "SELECTED", cuisine: "", chefName: "", imageUrl: "" });
    } catch (err) {
      alert("Erreur lors de la création");
    } finally {
      setBusy(false);
    }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await createQuestion(formData);
      setIsAdding(false);
      setFormData({ key: "", label: "", question: "", intro: "", order: initialQuestions.length });
    } catch (err) {
      alert("Erreur lors de la création");
    } finally {
      setBusy(false);
    }
  }

  async function handleAddOption(questionId: string) {
    setBusy(true);
    try {
      await createOption(questionId, newOptionData);
      setNewOptionData({ label: "", value: "", description: "", iconName: "Sparkles" });
    } catch (err) {
      alert("Erreur lors de l'ajout de l'option");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdateRestaurant(id: string) {
    setBusy(true);
    try {
      await updateRestaurant(id, editFormData);
      setEditingRestId(null);
    } catch (err) {
      alert("Erreur lors de la modification");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdateUser(id: string) {
    setBusy(true);
    try {
      await updateUser(id, editFormData);
      setEditingUserId(null);
    } catch (err) {
      alert("Erreur lors de la modification");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdateQuestion(id: string) {
    setBusy(true);
    try {
      await updateQuestion(id, editFormData);
      setEditingQuestionId(null);
    } catch (err) {
      alert("Erreur lors de la modification");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdateOption(id: string) {
    setBusy(true);
    try {
      await updateOption(id, editFormData);
      setEditingOptionId(null);
    } catch (err) {
      alert("Erreur lors de la modification");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* TABS */}
      <div className="flex gap-4 border-b border-ink/10 pb-4 overflow-x-auto">
        <button
          onClick={() => handleTabChange("restaurants")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition whitespace-nowrap ${
            activeTab === "restaurants" ? "bg-ink text-white" : "bg-white/50 text-ink/60 hover:bg-white"
          }`}
        >
          <UtensilsCrossed size={18} /> Restaurants
        </button>
        <button
          onClick={() => handleTabChange("users")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition whitespace-nowrap ${
            activeTab === "users" ? "bg-ink text-white" : "bg-white/50 text-ink/60 hover:bg-white"
          }`}
        >
          <Users size={18} /> Utilisateurs
        </button>
        <button
          onClick={() => handleTabChange("questionnaire")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition whitespace-nowrap ${
            activeTab === "questionnaire" ? "bg-ink text-white" : "bg-white/50 text-ink/60 hover:bg-white"
          }`}
        >
          <BookOpen size={18} /> Questionnaire
        </button>
      </div>

      {/* SEARCH AND ADD BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
          <input 
            type="text" 
            placeholder={`Rechercher un ${activeTab === "restaurants" ? "restaurant" : activeTab === "users" ? "utilisateur" : "chapitre"}...`} 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setRestPage(1);
              setUserPage(1);
            }}
            className="w-full rounded-xl border-none bg-white py-3 pl-10 pr-4 text-sm ring-1 ring-inset ring-ink/10 focus:ring-2 focus:ring-inset focus:ring-rouge"
          />
        </div>

        {(activeTab === "restaurants" || activeTab === "questionnaire") && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center gap-2 rounded-xl bg-rouge px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9d2626]"
          >
            <Plus size={16} /> Ajouter
          </button>
        )}
      </div>

      {/* RESTAURANTS VIEW */}
      {activeTab === "restaurants" && (
        <div className="space-y-6">
          {isAdding && (
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-ink/5">
              <h3 className="mb-4 text-lg font-semibold text-ink">Nouveau Restaurant</h3>
              <form onSubmit={handleAddRestaurant} className="grid gap-4 md:grid-cols-2">
                <input required placeholder="Nom du restaurant" className="rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required placeholder="Ville" className="rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                <input placeholder="Cuisine (ex: Française)" className="rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.cuisine} onChange={e => setFormData({...formData, cuisine: e.target.value})} />
                <input placeholder="Nom du Chef" className="rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.chefName} onChange={e => setFormData({...formData, chefName: e.target.value})} />
                <select className="rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}>
                  <option value="LOW">Low Budget</option>
                  <option value="MEDIUM">Medium Budget</option>
                  <option value="HIGH">High Budget</option>
                  <option value="LUXURY">Luxury</option>
                </select>
                <select className="rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.award} onChange={e => setFormData({...formData, award: e.target.value})}>
                  <option value="SELECTED">Sélectionné</option>
                  <option value="BIB_GOURMAND">Bib Gourmand</option>
                  <option value="ONE_STAR">1 Étoile</option>
                  <option value="TWO_STARS">2 Étoiles</option>
                  <option value="THREE_STARS">3 Étoiles</option>
                  <option value="GREEN_STAR">Étoile Verte</option>
                </select>
                <input type="url" placeholder="URL Image" className="md:col-span-2 rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                <input type="number" step="any" placeholder="Latitude" className="rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.latitude || ""} onChange={e => setFormData({...formData, latitude: e.target.value})} />
                <input type="number" step="any" placeholder="Longitude" className="rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.longitude || ""} onChange={e => setFormData({...formData, longitude: e.target.value})} />
                <div className="md:col-span-2">
                  <MapPicker 
                    lat={formData.latitude ? parseFloat(formData.latitude) : null} 
                    lng={formData.longitude ? parseFloat(formData.longitude) : null} 
                    onChange={(lat, lng) => setFormData({...formData, latitude: lat.toString(), longitude: lng.toString()})} 
                  />
                </div>
                <textarea placeholder="Description" className="md:col-span-2 h-24 rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setIsAdding(false)} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-ink/60 transition hover:bg-ink/5">Annuler</button>
                  <button type="submit" disabled={busy} className="rounded-xl bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-50">Créer</button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-ink/5">
            <table className="w-full text-left text-sm text-ink/70">
              <thead className="bg-porcelain text-xs uppercase text-ink">
                <tr>
                  <th className="px-6 py-4 cursor-pointer hover:bg-ink/5 transition" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-2">Nom <ArrowUpDown size={14} className="text-ink/30" /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-ink/5 transition" onClick={() => handleSort("city")}>
                    <div className="flex items-center gap-2">Ville <ArrowUpDown size={14} className="text-ink/30" /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-ink/5 transition" onClick={() => handleSort("award")}>
                    <div className="flex items-center gap-2">Distinction <ArrowUpDown size={14} className="text-ink/30" /></div>
                  </th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {paginatedRestaurants.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-ink/50">Aucun résultat trouvé</td></tr>
                ) : paginatedRestaurants.map(r => (
                  <tr key={r.id} className="transition hover:bg-porcelain/50">
                    {editingRestId === r.id ? (
                      <>
                        <td className="px-6 py-4"><input className="w-full rounded bg-porcelain px-2 py-1.5 outline-none ring-1 ring-ink/20" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} /></td>
                        <td className="px-6 py-4"><input className="w-full rounded bg-porcelain px-2 py-1.5 outline-none ring-1 ring-ink/20" value={editFormData.city} onChange={e => setEditFormData({...editFormData, city: e.target.value})} /></td>
                        <td className="px-6 py-4">
                          <select className="w-full rounded bg-porcelain px-2 py-1.5 outline-none ring-1 ring-ink/20" value={editFormData.award} onChange={e => setEditFormData({...editFormData, award: e.target.value})}>
                            <option value="SELECTED">Sélectionné</option>
                            <option value="BIB_GOURMAND">Bib Gourmand</option>
                            <option value="ONE_STAR">1 Étoile</option>
                            <option value="TWO_STARS">2 Étoiles</option>
                            <option value="THREE_STARS">3 Étoiles</option>
                            <option value="GREEN_STAR">Étoile Verte</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <input placeholder="URL Image" className="w-full rounded bg-porcelain px-2 py-1.5 text-xs outline-none ring-1 ring-ink/20" value={editFormData.imageUrl || ""} onChange={e => setEditFormData({...editFormData, imageUrl: e.target.value})} />
                            <div className="flex gap-1">
                              <input type="number" step="any" placeholder="Lat" className="w-1/2 rounded bg-porcelain px-2 py-1.5 text-xs outline-none ring-1 ring-ink/20" value={editFormData.latitude || ""} onChange={e => setEditFormData({...editFormData, latitude: e.target.value})} />
                              <input type="number" step="any" placeholder="Lng" className="w-1/2 rounded bg-porcelain px-2 py-1.5 text-xs outline-none ring-1 ring-ink/20" value={editFormData.longitude || ""} onChange={e => setEditFormData({...editFormData, longitude: e.target.value})} />
                            </div>
                            <MapPicker 
                              lat={editFormData.latitude ? parseFloat(editFormData.latitude) : null} 
                              lng={editFormData.longitude ? parseFloat(editFormData.longitude) : null} 
                              onChange={(lat, lng) => setEditFormData({...editFormData, latitude: lat.toString(), longitude: lng.toString()})} 
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-3">
                          <button disabled={busy} onClick={() => handleUpdateRestaurant(r.id)} className="text-moss hover:text-moss/80"><Check size={18} /></button>
                          <button disabled={busy} onClick={() => setEditingRestId(null)} className="text-ink/60 hover:text-ink"><X size={18} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-medium text-ink">{r.name}</td>
                        <td className="px-6 py-4">{r.city}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-ink/5 px-2.5 py-0.5 text-xs font-semibold text-ink/70">{r.award}</span>
                        </td>
                        <td className="px-6 py-4 flex justify-end gap-4">
                          <button disabled={busy} onClick={() => { setEditingRestId(r.id); setEditFormData(r); }} className="text-ink/40 hover:text-ink transition"><Pencil size={16} /></button>
                          <button disabled={busy} onClick={() => setDeletingRestId(r.id)} className="text-rouge/60 hover:text-[#9d2626] transition"><Trash2 size={16} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex items-center justify-between border-t border-ink/5 bg-porcelain/30 px-6 py-3">
              <span className="text-xs font-medium text-ink/50">
                Affichage de {Math.min(filteredRestaurants.length, (restPage - 1) * PAGE_SIZE + 1)} à {Math.min(filteredRestaurants.length, restPage * PAGE_SIZE)} sur {filteredRestaurants.length}
              </span>
              <div className="flex gap-1">
                <button onClick={() => setRestPage(p => Math.max(1, p - 1))} disabled={restPage === 1} className="p-1 rounded hover:bg-ink/10 disabled:opacity-30"><ChevronLeft size={16} /></button>
                <button onClick={() => setRestPage(p => Math.min(totalRestPages, p + 1))} disabled={restPage === totalRestPages} className="p-1 rounded hover:bg-ink/10 disabled:opacity-30"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USERS VIEW */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-ink/5">
            <table className="w-full text-left text-sm text-ink/70">
              <thead className="bg-porcelain text-xs uppercase text-ink">
                <tr>
                  <th className="px-6 py-4 cursor-pointer hover:bg-ink/5 transition" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-2">Nom / Pseudo <ArrowUpDown size={14} className="text-ink/30" /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-ink/5 transition" onClick={() => handleSort("username")}>
                    <div className="flex items-center gap-2">Username <ArrowUpDown size={14} className="text-ink/30" /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-ink/5 transition" onClick={() => handleSort("createdAt")}>
                    <div className="flex items-center gap-2">Inscrit le <ArrowUpDown size={14} className="text-ink/30" /></div>
                  </th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {paginatedUsers.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-ink/50">Aucun résultat trouvé</td></tr>
                ) : paginatedUsers.map(u => (
                  <tr key={u.id} className="transition hover:bg-porcelain/50">
                    {editingUserId === u.id ? (
                      <>
                        <td className="px-6 py-4"><input className="w-full rounded bg-porcelain px-2 py-1.5 outline-none ring-1 ring-ink/20" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} /></td>
                        <td className="px-6 py-4"><input className="w-full rounded bg-porcelain px-2 py-1.5 outline-none ring-1 ring-ink/20" value={editFormData.username} onChange={e => setEditFormData({...editFormData, username: e.target.value})} /></td>
                        <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <select className="w-full rounded bg-porcelain px-2 py-1.5 outline-none ring-1 ring-ink/20" value={editFormData.role} onChange={e => setEditFormData({...editFormData, role: e.target.value})}>
                            <option value="USER">Utilisateur</option>
                            <option value="ADMIN">Administrateur</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-3">
                          <button disabled={busy} onClick={() => handleUpdateUser(u.id)} className="text-moss hover:text-moss/80"><Check size={18} /></button>
                          <button disabled={busy} onClick={() => setEditingUserId(null)} className="text-ink/60 hover:text-ink"><X size={18} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-medium text-ink flex items-center gap-3">
                          {u.avatarUrl ? <img src={u.avatarUrl} className="w-8 h-8 rounded-full object-cover" alt="" /> : <div className="w-8 h-8 rounded-full bg-champagne" />}
                          {u.name}
                        </td>
                        <td className="px-6 py-4">{u.username}</td>
                        <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            u.role === "ADMIN" ? "bg-rouge/10 text-rouge" : "bg-ink/5 text-ink/70"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex justify-end gap-4">
                          <button disabled={busy} onClick={() => { setEditingUserId(u.id); setEditFormData(u); }} className="text-ink/40 hover:text-ink transition"><Pencil size={16} /></button>
                          <button disabled={busy} onClick={() => setDeletingUserId(u.id)} className="text-rouge/60 hover:text-[#9d2626] transition"><Trash2 size={16} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex items-center justify-between border-t border-ink/5 bg-porcelain/30 px-6 py-3">
              <span className="text-xs font-medium text-ink/50">
                Affichage de {Math.min(filteredUsers.length, (userPage - 1) * PAGE_SIZE + 1)} à {Math.min(filteredUsers.length, userPage * PAGE_SIZE)} sur {filteredUsers.length}
              </span>
              <div className="flex gap-1">
                <button onClick={() => setUserPage(p => Math.max(1, p - 1))} disabled={userPage === 1} className="p-1 rounded hover:bg-ink/10 disabled:opacity-30"><ChevronLeft size={16} /></button>
                <button onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))} disabled={userPage === totalUserPages} className="p-1 rounded hover:bg-ink/10 disabled:opacity-30"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUESTIONNAIRE VIEW */}
      {activeTab === "questionnaire" && (
        <div className="space-y-6">
          {isAdding && (
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-ink/5">
              <h3 className="mb-4 text-lg font-semibold text-ink">Nouveau Chapitre</h3>
              <form onSubmit={handleAddQuestion} className="grid gap-4 md:grid-cols-2">
                <input required placeholder="ID technique (ex: occasion)" className="rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.key} onChange={e => setFormData({...formData, key: e.target.value})} />
                <input required placeholder="Label menu (ex: Occasion)" className="rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} />
                <input required placeholder="La question" className="md:col-span-2 rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} />
                <textarea placeholder="Texte d'introduction" className="md:col-span-2 h-20 rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.intro} onChange={e => setFormData({...formData, intro: e.target.value})} />
                <input type="number" placeholder="Ordre" className="rounded-xl border-none bg-porcelain p-3.5 text-sm ring-1 ring-inset ring-ink/10" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
                <div className="flex justify-end gap-3 mt-2 md:col-span-1">
                  <button type="button" onClick={() => setIsAdding(false)} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-ink/60 transition hover:bg-ink/5">Annuler</button>
                  <button type="submit" disabled={busy} className="rounded-xl bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-50">Créer</button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {initialQuestions.map((q) => (
              <div key={q.id} className="rounded-2xl bg-white border border-ink/5 shadow-sm overflow-hidden">
                <div className="bg-porcelain/50 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-white text-xs font-bold">
                      {q.order + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-ink">{q.label}</h4>
                      <p className="text-xs text-ink/50">{q.question}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingQuestionId(q.id); setEditFormData(q); }} className="p-2 text-ink/40 hover:text-ink transition"><Pencil size={18} /></button>
                    <button onClick={() => setDeletingQuestionId(q.id)} className="p-2 text-rouge/60 hover:text-rouge transition"><Trash2 size={18} /></button>
                  </div>
                </div>

                {editingQuestionId === q.id && (
                   <div className="p-6 border-b border-ink/5 bg-porcelain/10">
                     <div className="grid gap-4 md:grid-cols-2">
                        <input placeholder="Label" className="rounded-lg bg-white p-2.5 text-sm ring-1 ring-ink/10" value={editFormData.label} onChange={e => setEditFormData({...editFormData, label: e.target.value})} />
                        <input placeholder="ID" className="rounded-lg bg-white p-2.5 text-sm ring-1 ring-ink/10" value={editFormData.key} onChange={e => setEditFormData({...editFormData, key: e.target.value})} />
                        <input placeholder="Question" className="md:col-span-2 rounded-lg bg-white p-2.5 text-sm ring-1 ring-ink/10" value={editFormData.question} onChange={e => setEditFormData({...editFormData, question: e.target.value})} />
                        <textarea placeholder="Intro" className="md:col-span-2 rounded-lg bg-white p-2.5 text-sm ring-1 ring-ink/10" value={editFormData.intro} onChange={e => setEditFormData({...editFormData, intro: e.target.value})} />
                        <div className="md:col-span-2 flex justify-end gap-2">
                          <button onClick={() => setEditingQuestionId(null)} className="px-4 py-2 text-sm font-medium text-ink/50">Annuler</button>
                          <button onClick={() => handleUpdateQuestion(q.id)} className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white">Sauvegarder</button>
                        </div>
                     </div>
                   </div>
                )}

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs uppercase tracking-widest font-bold text-ink/30">Options de réponse</h5>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {q.options.map((opt: any) => (
                      <div key={opt.id} className="group relative rounded-xl border border-ink/5 bg-porcelain/30 p-4 transition hover:border-ink/10 hover:bg-white">
                        {editingOptionId === opt.id ? (
                          <div className="space-y-2">
                            <input className="w-full text-sm font-bold bg-white p-1 rounded ring-1 ring-ink/10" value={editFormData.label} onChange={e => setEditFormData({...editFormData, label: e.target.value})} />
                            <input className="w-full text-xs bg-white p-1 rounded ring-1 ring-ink/10" value={editFormData.value} onChange={e => setEditFormData({...editFormData, value: e.target.value})} />
                            <textarea className="w-full text-xs bg-white p-1 rounded ring-1 ring-ink/10" value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} />
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setEditingOptionId(null)}><X size={14} /></button>
                              <button onClick={() => handleUpdateOption(opt.id)}><Check size={14} className="text-moss" /></button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-rouge shadow-sm">
                                <Sparkles size={16} />
                              </div>
                              <div className="flex opacity-0 group-hover:opacity-100 transition">
                                <button onClick={() => { setEditingOptionId(opt.id); setEditFormData(opt); }} className="p-1 text-ink/30 hover:text-ink"><Pencil size={14} /></button>
                                <button onClick={() => setDeletingOptionId(opt.id)} className="p-1 text-rouge/30 hover:text-rouge"><Trash2 size={14} /></button>
                              </div>
                            </div>
                            <div className="mt-3">
                              <p className="font-bold text-ink text-sm">{opt.label}</p>
                              <p className="text-[10px] text-ink/40 font-mono mb-1">{opt.value}</p>
                              <p className="text-xs text-ink/60 line-clamp-2">{opt.description}</p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    <div className="rounded-xl border border-dashed border-ink/10 p-4 flex flex-col justify-center items-center gap-2">
                       <input className="w-full text-xs p-1 bg-white/50 rounded ring-1 ring-ink/5" placeholder="Label" value={newOptionData.label} onChange={e => setNewOptionData({...newOptionData, label: e.target.value})} />
                       <input className="w-full text-xs p-1 bg-white/50 rounded ring-1 ring-ink/5" placeholder="Valeur" value={newOptionData.value} onChange={e => setNewOptionData({...newOptionData, value: e.target.value})} />
                       <button onClick={() => handleAddOption(q.id)} className="w-full py-1 bg-ink text-white rounded text-xs font-bold">+ Ajouter</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {(deletingRestId || deletingUserId || deletingQuestionId || deletingOptionId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div
            className="absolute inset-0"
            onClick={() => { setDeletingRestId(null); setDeletingUserId(null); setDeletingQuestionId(null); setDeletingOptionId(null); }}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rouge/10">
              <Trash2 size={24} className="text-rouge" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-ink">
              Confirmer la suppression
            </h2>
            <p className="mb-6 text-sm text-ink/60">
              Êtes-vous sûr de vouloir supprimer définitivement cet élément ? Cette action est irréversible.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => { setDeletingRestId(null); setDeletingUserId(null); setDeletingQuestionId(null); setDeletingOptionId(null); }}
                disabled={busy}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-ink/60 transition hover:bg-ink/5 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                   if (deletingRestId) handleDeleteRestaurant(deletingRestId);
                   else if (deletingUserId) handleDeleteUser(deletingUserId);
                   else if (deletingQuestionId) deleteQuestion(deletingQuestionId).then(() => setDeletingQuestionId(null));
                   else if (deletingOptionId) deleteOption(deletingOptionId).then(() => setDeletingOptionId(null));
                }}
                disabled={busy}
                className="rounded-xl bg-rouge px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-rouge/90 disabled:opacity-50"
              >
                {busy ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
