import React, { useState } from "react";

export default function QuizEngine({ questions = [], onComplete = ()=>{} }) {
  const [i, setI] = useState(0);
  const [sel, setSel] = useState(null);
  const [feedback, setFeedback] = useState("");

  if (!questions.length) return <p>No questions.</p>;
  const q = questions[i];

  function check() {
    let correct = false;
    if (q.type === "mcq") correct = sel === q.answerIndex;
    if (q.type === "true_false") correct = sel === (q.answer ? 1 : 0);
    if (q.type === "fill_blank") correct = (String(sel || "").trim().toLowerCase() === String(q.answer || "").trim().toLowerCase());
    setFeedback(correct ? "✅ Correct!" : `❌ ${q.explanation || "Keep trying."}`);
  }

  function next() {
    if (i === questions.length - 1) onComplete();
    else { setI(i+1); setSel(null); setFeedback(""); }
  }

  return (
    <div className="duo-card max-w-2xl mx-auto p-4">
      <div className="text-xl mb-4">{q.prompt}</div>

      {q.type === "mcq" && (
        <div className="grid gap-2">
          {q.options.map((o, idx) => (
            <button key={idx} onClick={()=>setSel(idx)} className={`duo-card ${sel === idx ? "ring-2 ring-[var(--brand)]" : ""}`}>{o}</button>
          ))}
        </div>
      )}

      {q.type === "true_false" && (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={()=>setSel(1)} className={`duo-card ${sel===1 ? "ring-2 ring-[var(--brand)]" : ""}`}>True</button>
          <button onClick={()=>setSel(0)} className={`duo-card ${sel===0 ? "ring-2 ring-[var(--brand)]" : ""}`}>False</button>
        </div>
      )}

      {q.type === "fill_blank" && (
        <input className="w-full border rounded-xl p-3 mb-3" value={sel||""} onChange={e => setSel(e.target.value)} placeholder="Type your answer"/>
      )}

      <div className="flex gap-3 mt-3">
        <button className="duo-btn" onClick={check}>Check</button>
        <button className="duo-btn" onClick={next}>Continue</button>
      </div>

      {feedback && <div className="mt-3">{feedback}</div>}
    </div>
  );
}