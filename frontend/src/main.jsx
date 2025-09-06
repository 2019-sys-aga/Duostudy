import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./tailwind.css";
import Home from "./pages/Home.jsx";
import Lesson from "./pages/Lesson.jsx";
import Flashcards from "./pages/Flashcards.jsx";
import Auth from "./pages/Auth.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Home />} />
      <Route path="/lesson/:idx" element={<Lesson />} />
      <Route path="/flashcards" element={<Flashcards />} />
    </Routes>
  </BrowserRouter>
);