import { useState, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";
import LeadForm, { STATUSES } from "./LeadForm.jsx";

const today = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [leads, setLeads] = useLocalStorage("leads", []);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const saveLead = (data) => {
    if (editing) {
      setLeads(leads.map((l) => (l.id === editing.id ? { ...l, ...data } : l)));
      setEditing(null);
    } else {
      setLeads([{ ...data, id: Date.now() }, ...leads]);
    }
  };

  const removeLead = (id) => {
    if (confirm("Delete this lead?")) setLeads(leads.filter((l) => l.id !== id));
  };

  const counts = useMemo(
    () => Object.fromEntries(STATUSES.map((s) => [s, leads.filter((l) => l.status === s).length])),
    [leads]
  );

  const visible = leads.filter((l) => {
    const q = search.toLowerCase();
    const matches = l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q);
    return matches && (filter === "All" || l.status === filter);
  });

  const dueToday = leads.filter((l) => l.followUp && l.followUp <= today() && l.status !== "Closed");

  return (
    <div className="app">
      <header>
        <h1>Lead Tracker</h1>
        <p>{leads.length} leads, {dueToday.length} need a follow-up today</p>
      </header>

      <section className="pipeline" aria-label="Pipeline">
        {STATUSES.map((s) => (
          <button key={s} className={`stage s-${s.replace(" ", "").toLowerCase()} ${filter === s ? "on" : ""}`}
            onClick={() => setFilter(filter === s ? "All" : s)}>
            <strong>{counts[s]}</strong><span>{s}</span>
            <i style={{ width: leads.length ? `${(counts[s] / leads.length) * 100}%` : 0 }} />
          </button>
        ))}
      </section>

      <main>
        <LeadForm editing={editing} onSave={saveLead} onCancel={() => setEditing(null)} />

        <section className="panel list">
          <div className="row">
            <input placeholder="Search by name or company" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {visible.length === 0 && (
            <p className="empty">{leads.length ? "No leads match your search." : "No leads yet. Add your first one on the left."}</p>
          )}

          <ul>
            {visible.map((l) => (
              <li key={l.id}>
                <div>
                  <h3>{l.name} <span className={`tag s-${l.status.replace(" ", "").toLowerCase()}`}>{l.status}</span></h3>
                  <p>{[l.company, l.phone].filter(Boolean).join(" | ")}</p>
                  {l.followUp && (
                    <p className={l.followUp <= today() && l.status !== "Closed" ? "due" : ""}>Follow up: {l.followUp}</p>
                  )}
                  {l.notes && <p className="notes">{l.notes}</p>}
                </div>
                <div className="actions">
                  <button onClick={() => setEditing(l)}>Edit</button>
                  <button className="danger" onClick={() => removeLead(l.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
