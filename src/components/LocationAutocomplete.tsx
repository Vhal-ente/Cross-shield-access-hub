import React, { useEffect, useMemo, useRef, useState } from "react";

type Suggestion = {
  place_id: string;
  display_name: string;
  address: {
    country_code?: string;
  };
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  onCountryDetect?: (iso2: string | undefined) => void;
  placeholder?: string;
};

export default function LocationAutocomplete({
  value,
  onChange,
  onCountryDetect,
  placeholder = "Start typing your address or city"
}: Props) {
  const [q, setQ] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => setQ(value), [value]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (!q || q.trim().length < 3) {
      setItems([]);
      return;
    }
    timerRef.current = window.setTimeout(async () => {
      try {
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
        setLoading(true);
        const url =
          "https://nominatim.openstreetmap.org/search?" +
          new URLSearchParams({
            q,
            format: "json",
            addressdetails: "1",
            limit: "5",
            email: "support@yourdomain.tld"
          }).toString();
        const res = await fetch(url, {
          signal: abortRef.current.signal,
          headers: {
            Accept: "application/json",
            Referer: window.location.origin
          }
        });
        if (!res.ok) {
          setItems([]);
          setLoading(false);
          return;
        }
        const data = (await res.json()) as any[];
        const mapped = data.map((d) => ({
          place_id: String(d.place_id),
          display_name: String(d.display_name),
          address: d.address || {}
        }));
        setItems(mapped);
      } catch {
        if (abortRef.current?.signal.aborted) return;
        setItems([]);
      } finally {
        setLoading(false);
        setOpen(true);
      }
    }, 350);
  }, [q]);

  function choose(s: Suggestion) {
    onChange(s.display_name);
    onCountryDetect?.(s.address.country_code?.toUpperCase());
    setQ(s.display_name);
    setOpen(false);
  }

  return (
    <div ref={boxRef} className="relative">
      <input
        type="text"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          onChange(e.target.value);
        }}
        onFocus={() => items.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
        autoComplete="off"
      />
      {open && (loading || items.length > 0) && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow">
          {loading && (
            <div className="p-3 text-sm text-gray-500">Searching...</div>
          )}
          {!loading && items.length === 0 && (
            <div className="p-3 text-sm text-gray-500">No matches</div>
          )}
          {!loading &&
            items.map((s) => (
              <button
                key={s.place_id}
                type="button"
                onClick={() => choose(s)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
              >
                <div className="text-sm text-gray-900">{s.display_name}</div>
              </button>
            ))}
        </div>
        
      )}
    </div>
  );
}
