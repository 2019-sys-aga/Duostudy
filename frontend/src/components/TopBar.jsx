import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(r => setUser(r.data.user)).catch(()=>setUser(null));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    nav("/auth");
  }

  return (
    <div className="w-full bg-white border-b p-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--brand)] grid place-items-center text-white font-bold">🦉</div>
          <div className="font-bold">Duostudy</div>
        </div>
        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <div className="text-sm">{user.email}</div>
              <button className="px-3 py-1 border rounded" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <button className="duo-btn" onClick={()=>nav("/auth")}>Sign in</button>
          )}
        </div>
      </div>
    </div>
  );
}