// Basic API functions that proxy to backend
export async function uploadFileOrText(input) {
  const fd = new FormData();
  if (input instanceof File) fd.append("file", input);
  else fd.append("text", input);

  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed " + await res.text());
  return res.json();
}

export async function generateLessons(flashcards) {
  const res = await fetch("/api/generate-lesson", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flashcards })
  });
  if (!res.ok) throw new Error("Lesson gen failed");
  return res.json();
}

export async function saveProgress(data) {
  await fetch("/api/progress/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: data.userId || "local", data })
  });
}

export async function loadProgress(userId) {
  const res = await fetch("/api/progress/load", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: userId || "local" })
  });
  return res.json();
}