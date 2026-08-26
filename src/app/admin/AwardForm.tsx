"use client";

import { useState } from "react";
import { Coins, Plus } from "lucide-react";
import { awardCoins } from "@/app/actions";

export default function AwardForm({ users }: { users: { id: string, email: string, full_name: string }[] }) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [packageId, setPackageId] = useState("");

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set()); // deselect all
    } else {
      setSelectedUsers(new Set(users.map(u => u.id))); // select all
    }
  };

  const handleToggle = (id: string) => {
    const next = new Set(selectedUsers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedUsers(next);
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-secondary/30 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Coins className="w-5 h-5 text-secondary" />
        <h2 className="font-bold text-lg text-foreground">Award Packages</h2>
      </div>
      <p className="text-xs text-foreground/60 mb-6 leading-relaxed flex-1">
        Select members to reward them. A nicely designed email will automatically notify them of their new package.
      </p>
      
      <form className="space-y-5" action={awardCoins}>
        {/* Hidden inputs to pass selected user IDs */}
        {Array.from(selectedUsers).map(id => (
          <input key={id} type="hidden" name="userIds" value={id} />
        ))}
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest">Select Members</label>
            <button type="button" onClick={handleSelectAll} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">
              {selectedUsers.size === users.length ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl bg-gray-50 p-2 space-y-1">
            {users?.map(u => (
              <label key={u.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-100 shadow-sm hover:shadow">
                <input 
                  type="checkbox" 
                  checked={selectedUsers.has(u.id)}
                  onChange={() => handleToggle(u.id)}
                  className="rounded text-primary focus:ring-primary/20 cursor-pointer" 
                />
                <span className="text-sm font-medium text-gray-700">{u.full_name || u.email}</span>
              </label>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5">{selectedUsers.size} member(s) selected</p>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Select Package</label>
          <select 
            name="packageId" 
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 outline-none transition-all" 
            required
          >
            <option value="">Select a package...</option>
            <option value="david">David Prophet Package (20 coins - Tasbeha)</option>
            <option value="samuel">Samuel Prophet Package (20 coins - Bible Study)</option>
            <option value="upper_room">The Upper Room Package (50 coins - Both)</option>
            <option value="paul">Saint Pauls Package (70 coins - Service)</option>
            <option value="nehemiah">Nehemiahs Package (30 coins - Engager)</option>
            <option value="christmas_night">Christmas Night Badge (100 coins - Major Event)</option>
            <option value="welcome_badge">Welcome Badge (20 coins - Joined)</option>
            <option value="other">Other (Custom Points)</option>
          </select>
        </div>
        
        {packageId === "other" && (
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 border border-gray-200 rounded-xl">
            <div>
              <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Reason</label>
              <input type="text" name="customReason" placeholder="e.g. Setting up chairs" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white outline-none" required />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Coins to Add</label>
              <input type="number" name="customPoints" placeholder="e.g. 15" min="1" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white outline-none" required />
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={selectedUsers.size === 0 || !packageId}
          className="w-full bg-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" /> Award {selectedUsers.size > 1 ? `(${selectedUsers.size} Members)` : "Package"}
        </button>
      </form>
    </div>
  );
}
