import React, { useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [mode, setMode] = useState("signin"); // signin | signup
  const nav = useNavigate();

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({ email, password: pw });
    if (error) return alert(error.message);
    alert("Check your email for confirmation link");
  }

  async function handleSignin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) return alert(error.message);
    nav("/");
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Sign {mode === "signin" ? "In" : "Up"}</h2>
      <input className="w-full p-3 mb-3 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" className="w-full p-3 mb-3 border rounded" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} />
      {mode === "signin" ? (
        <button className="duo-btn" onClick={handleSignin}>Sign in</button>
      ) : (
        <button className="duo-btn" onClick={handleSignup}>Sign up</button>
      )}
      <div className="mt-3 text-sm">
        <button onClick={()=>setMode(mode==="signin"?"signup":"signin")} className="underline">
          {mode==="signin" ? "Create an account" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}