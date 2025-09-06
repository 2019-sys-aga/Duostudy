import React, { useEffect, useState } from "react";
import Flashcard from "../components/Flashcard.jsx";
import { loadProgress } from "../api.js";
import TopBar from "../components/TopBar.jsx";

export default function Flashcards() {
  const [cards, setCards] = useState([]);
  const [i, setI] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await loadProgress();
      setCards(data.flashcards || []);
    })();
  }, []);

  if (!cards.length) return <div className="p-6">No flashcards yet. Upload some material first.</div>;

  return (
    <div>
      <TopBar />
      <div className="max-w-3xl mx-auto p-6">
        <Flashcard card={cards[i]} />
        <div className="flex gap-3 mt-4">
          <button className="duo-btn" onClick={()=>setI(Math.max(0, i-1))} disabled={i===0}>Prev</button>
          <button className="duo-btn" onClick={()=>setI(Math.min(cards.length-1, i+1))} disabled={i===cards.length-1}>Next</button>
        </div>
      </div>
    </div>
  );
}