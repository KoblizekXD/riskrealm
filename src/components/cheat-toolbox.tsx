"use client";

import { updateBalance } from "@/lib/supabase/actions";
import { Menu } from "lucide-react";
import { useState } from "react";

export function CheatToolbox() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button title="Cheat Toolbox" onClick={() => setOpen(prev => !prev)} className="border border-black rounded-md bg-black/50 fixed right-2 p-1 cursor-pointer top-1/2" type="button">
        <Menu size={32} />
      </button>
      <div className="fixed right-2 z-50 top-2 left-2" style={{ display: open ? "block" : "none" }}>
        <div className="border border-black flex flex-col rounded-md bg-black/90 p-2">
          <h1>Cheat Toolbox</h1>
          <form onSubmit={(element) => {
            element.preventDefault();
            const fd = new FormData(element.currentTarget);
            const count = fd.get("count") as number | null;
            if (count) {
              updateBalance(count).then(() => {
                alert("Added tickets! Refresh to see updated balance.");
              });
            }
          }} className="flex gap-2">
            <input name="count" type="number" placeholder="Set tickets..." />
            <button className="border p-1 rounded-md" type="submit">Add</button>
          </form>
        </div>
      </div>
    </>
  )
}