import os
from typing import Optional

try:
    from supabase import create_client, Client
except Exception:  # pragma: no cover
    create_client = None  # type: ignore
    Client = object  # type: ignore

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Optional["Client"] = None
if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY and create_client:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)