import { useState, useEffect } from "react";

export const STATUSES = ["New", "Contacted", "Follow-up", "Closed"];
const empty = { name: "", company: "", phone: "", status: "New", followUp: "", notes: "" };

export default function LeadForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => { setForm(editing || empty); }, [editing]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
    setForm(empty);
  };

  return (
    <form className="panel form" onSubmit={submit}>
      <h2>{editing ? "Edit lead" : "Add a lead"}</h2>
      <label>Name<input name="name" value={form.name} onChange={change} required /></label>
      <label>Company<input name="company" value={form.company} onChange={change} /></label>
      <label>Phone<input name="phone" value={form.phone} onChange={change} /></label>
      <label>Status
        <select name="status" value={form.status} onChange={change}>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label>Follow-up date<input type="date" name="followUp" value={form.followUp} onChange={change} /></label>
      <label>Notes<textarea name="notes" rows="3" value={form.notes} onChange={change} /></label>
      <div className="row">
        <button className="primary" type="submit">{editing ? "Save changes" : "Add lead"}</button>
        {editing && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
