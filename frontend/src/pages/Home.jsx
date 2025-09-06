import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar.jsx";
import FileDrop from "../components/FileDrop.jsx";
import SkillTree from "../components/SkillTree.jsx";
import Flashcard from "../components/Flashcard.jsx";
import { uploadFileOrText, generateLessons, saveProgress, loadProgress } from "../api.js";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";

export default function Home() {
  const [flashcards, setFlashcards] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [skills, setSkills] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      supabase.auth.getUser().then(r => r.data.user).catch(()=>null);
      const { data } = await loadProgress();
      if (data.flashcards) setFlashcards(data.flashcards);
      if (data.lessons) setLessons(data.lessons);
      if (data.skills) setSkills(data.skills);
    })();
  }, []);

  async function handleFile(file) {
    try {
      const { flashcards: fc } = await uploadFileOrText(file);
      setFlashcards(fc);
      const { lessons: ls } = await generateLessons(fc);
      setLessons(ls || []);
      const newSkills = (ls || []).map((l, idx) => ({ id: idx, title: l.title || `Lesson ${idx+1}`, completed: false, locked: idx>0 }));
      setSkills(newSkills);
      await saveProgress({ flashcards: fc, lessons: ls, skills: newSkills });
    } catch (e) {
      alert("Error generating content: " + e.message);
    }
  }

  return (
    <div>
      <TopBar />
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-[var(--brand)]">🦉 Duostudy</h1>
        </div>
        <FileDrop onFile={handleFile}/>
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">Skill Tree</h2>
          <SkillTree skills={skills} onOpen={(i)=>nav(`/lesson/${i}`)} />
        </section>
        {flashcards.length>0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-2">Flashcard Preview</h2>
            <Flashcard card={flashcards[0]} />
          </section>
        )}
      </main>
    </div>
  );
}