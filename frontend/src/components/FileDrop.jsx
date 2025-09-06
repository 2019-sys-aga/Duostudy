import React, { useState } from "react";

export default function FileDrop({ onFile }) {
  const [hover, setHover] = useState(false);
  return (
    <label
      onDragOver={(e)=>{e.preventDefault(); setHover(true)}}
      onDragLeave={()=>setHover(false)}
      onDrop={(e)=>{e.preventDefault(); setHover(false); onFile(e.dataTransfer.files[0])}}
      className={`duo-card w-full max-w-xl text-center ${hover ? "ring-2 ring-[var(--brand)]": ""} cursor-pointer`}
    >
      <input type="file" className="hidden" onChange={e=>onFile(e.target.files[0])} />
      <div className="text-lg font-semibold">Drop PDF/DOCX/IMG here or click to upload</div>
      <div className="text-gray-500 mt-1">We auto-generate flashcards & lessons</div>
    </label>
  );
}