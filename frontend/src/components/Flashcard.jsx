import React, { useState } from "react";

export default function Flashcard({ card }) {
  const [flip, setFlip] = useState(false);
  if (!card) return null;
  return (
    <div className="duo-card max-w-md mx-auto p-6 cursor-pointer text-center" onClick={()=>setFlip(!flip)}>
      <div className="text-2xl font-bold">{flip ? card.back : card.front}</div>
      {flip && card.explanation && <div className="text-sm text-gray-500 mt-2">{card.explanation}</div>}
    </div>
  );
}