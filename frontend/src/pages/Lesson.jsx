import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadProgress, saveProgress } from "../api.js";
import QuizEngine from "../components/QuizEngine.jsx";
import TopBar from "../components/TopBar.jsx";

export default function Lesson() {
  const { idx } = useParams();
  const nav = useNavigate();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await loadProgress();
      setLesson(data.lessons?.[idx] || null);
    })();
  }, [idx]);

  async function finish() {
    const { data } = await loadProgress();
    if (data.skills?.[idx]) data.skills[idx].completed = true;
    await saveProgress(data);
    nav("/");
  }

  if (!lesson) return <div className="p-6">No lesson found.</div>;

  return (
    <div>
      <TopBar />
      <div className="max-w-4xl mx-auto p-6">
        <button className="duo-btn mb-4" onClick={()=>nav("/")}>← Back</button>
        <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
        <div className="duo-card mb-6">
          <ul className="list-disc ml-6">
            {lesson.teachPoints?.map((t,i)=><li key={i}>{t}</li>)}
          </ul>
        </div>
        <QuizEngine questions={lesson.questions || []} onComplete={finish} />
      </div>
    </div>
  );
}