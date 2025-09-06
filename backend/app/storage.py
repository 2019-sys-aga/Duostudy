import json
import os
from pathlib import Path
from typing import Any, Dict

from .supabase_client import supabase

LOCAL_PATH = Path(os.getcwd()) / ".local_progress.json"


async def save_progress(user_id: str, data: Dict[str, Any]) -> bool:
    if supabase is not None:
        resp = supabase.table("progress").upsert({"user_id": user_id, "data": data}).execute()
        if getattr(resp, "error", None):  # type: ignore[attr-defined]
            raise RuntimeError(str(resp.error))  # pragma: no cover
        return True

    store: Dict[str, Any] = {}
    if LOCAL_PATH.exists():
        try:
            store = json.loads(LOCAL_PATH.read_text("utf-8") or "{}")
        except Exception:
            store = {}
    store[user_id or "local"] = data
    LOCAL_PATH.write_text(json.dumps(store, indent=2))
    return True


async def load_progress(user_id: str) -> Dict[str, Any]:
    if supabase is not None:
        resp = supabase.table("progress").select("data").eq("user_id", user_id).single().execute()
        data = getattr(resp, "data", None)
        if not data:
            return {}
        return data.get("data") or {}

    if LOCAL_PATH.exists():
        try:
            store = json.loads(LOCAL_PATH.read_text("utf-8") or "{}")
            return store.get(user_id or "local", {})
        except Exception:
            return {}
    return {}