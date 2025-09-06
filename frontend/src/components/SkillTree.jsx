import React from "react";
import { motion } from "framer-motion";

export default function SkillTree({ skills = [], onOpen = ()=>{} }) {
  return (
    <div className="flex flex-col items-center mt-6 space-y-8">
      {skills.map((s, i) => (
        <motion.button
          key={s.id || i}
          onClick={()=>onOpen(i)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 150, delay: i*0.05 }}
          className={`w-20 h-20 rounded-full text-white font-bold shadow ${s.completed ? "bg-yellow-400" : s.locked ? "bg-gray-300" : "bg-[var(--brand)]"}`}
          title={s.title}
        >
          {s.completed ? "★" : s.title?.slice(0,2).toUpperCase() || "L"}
        </motion.button>
      ))}
    </div>
  );
}