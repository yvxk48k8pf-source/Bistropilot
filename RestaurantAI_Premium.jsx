import { useState, useEffect, useRef } from "react";

const G = {
  bg: "#080808",
  surface: "#111111",
  card: "#161616",
  cardHover: "#1C1C1C",
  border: "#2A2A2A",
  gold: "#C9A84C",
  goldLight: "#E8C97A",
  goldDim: "#C9A84C18",
  goldBorder: "#C9A84C33",
  green: "#4CAF7D",
  red: "#E05252",
  blue: "#4A9EDB",
  text: "#F0EDE8",
  muted: "#666666",
  mutedLight: "#888888",
};

const CATS = {
  fournisseurs: { label: "Fournisseurs", color: G.gold, emoji: "🥩" },
  loyer: { label: "Loyer", color: G.blue, emoji: "🏠" },
  energie: { label: "Énergie", color: "#9B6FDB", emoji: "⚡" },
  salaires: { label: "Salaires", color: G.green, emoji: "👥" },
  materiel: { label: "Matériel", color: "#DB8B4A", emoji: "🔧" },
  marketing: { label: "Marketing", color: "#4ADBC8", emoji: "📣" },
  autres: { label: "Autres", color: G.muted, emoji: "📦" },
};

const INIT = {
  nom: "Le Petit Bistrot",
  budgetMensuel: 25000,
  depenses: [
    { id: 1, label: "Fournisseur viande", montant: 3200, categorie: "fournisseurs", date: "2026-04-02" },
    { id: 2, label: "Loyer avril", montant: 4500, categorie: "loyer", date: "2026-04-01" },
    { id: 3, label: "Électricité", montant: 620, categorie: "energie", date: "2026-04-03" },
    { id: 4, label: "Légumes & primeurs", montant: 980, categorie: "fournisseurs", date: "2026-04-05" },
    { id: 5, label: "Matériel cuisine", montant: 340, categorie: "materiel", date: "2026-04-06" },
    { id: 6, label: "Publicité Instagram", montant: 150, categorie: "marketing", date: "2026-04-08" },
  ],
  employes: [
    { id: 1, nom: "Sophie Martin", poste: "Chef cuisinière", salaire: 2800, statut: "CDI" },
    { id: 2, nom: "Lucas Bernard", poste: "Serveur", salaire: 1850, statut: "CDI" },
    { id: 3, nom: "Emma Dubois", poste: "Serveuse", salaire: 1850, statut: "CDI" },
    { id: 4, nom: "Antoine Leroy", poste: "Plongeur", salaire: 1600, statut: "CDD" },
  ],
  recettes: [
    { mois: "Jan", ca: 28400, dep: 22100 },
    { mois: "Fév", ca: 31200, dep: 24300 },
    { mois: "Mar", ca: 29800, dep: 23500 },
    { mois: "Avr", ca: 33100, dep: 18900 },
  ],
  plats: [
    { nom: "Entrecôte frites", prix: 22, cout: 8.5, ventes: 142 },
    { nom: "Salade César", prix: 14, cout: 3.2, ventes: 98 },
    { nom: "Moules marinières", prix: 18, cout: 6.1, ventes: 87 },
    { nom: "Tarte Tatin", prix: 9, cout: 2.4, ventes: 124 },
  ],
};

const euro = n => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const pct = (a, b) => b === 0 ? 0 : Math.round((a / b) * 100);
const initials = name => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

// ── UI Atoms ────────────────────────────────────────────────────────────────
const GoldDivider = () => (
  <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${G.gold}, transparent)`, margin: "20px 0" }} />
);

const Pill = ({ children, color = G.gold }) => (
  <span style={{
    background: color + "18", color, border: `1px solid ${color}44`,
    borderRadius: 30, padding: "3px 12px", fontSize: 10,
    fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase",
  }}>{children}</span>
);

const StatRow = ({ label, value, color = G.text }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${G.border}` }}>
    <span style={{ fontSize: 13, color: G.muted }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
  </div>
);

const GoldBar = ({ value, max, color = G.gold }) => (
  <div style={{ height: 3, borderRadius: 3, background: G.border, overflow: "hidden", marginTop: 8 }}>
    <div style={{
      height: "100%", borderRadius: 3,
      background: `linear-gradient(90deg, ${color}, ${color}88)`,
      width: `${Math.min(pct(value, max), 100)}%`,
      transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
    }} />
  </div>
);

// ── Screens ─────────────────────────────────────────────────────────────────
function DashboardScreen({ state }) {
  const totalDep = state.depenses.reduce((s, d) => s + d.montant, 0);
  const totalSal = state.employes.reduce((s, e) => s + e.salaire, 0);
  const ca = state.recettes[state.recettes.length - 1]?.ca || 0;
  const charges = totalDep + totalSal;
  const benef = ca - charges;
  const maxCA = Math.max(...state.recettes.map(r => r.ca));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Hero card */}
      <div style={{
        background: `linear-gradient(135deg, #1A1500 0%, #0D0D0D 50%, #001A0A 100%)`,
        border: `1px solid ${G.goldBorder}`,
        borderRadius: 24, padding: "28px 24px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: G.gold + "08" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: G.green + "08" }} />
        <div style={{ fontSize: 11, color: G.gold, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Bénéfice net • Avril 2026</div>
        <div style={{ fontSize: 44, fontWeight: 900, color: benef >= 0 ? G.goldLight : G.red, letterSpacing: "-2px", marginBottom: 4 }}>
          {euro(benef)}
        </div>
        <div style={{ fontSize: 13, color: G.mutedLight }}>Marge {pct(benef, ca)}% • CA {euro(ca)}</div>
        <GoldDivider />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { label: "Chiffre d'affaires", val: euro(ca), color: G.green },
            { label: "Charges totales", val: euro(charges), color: G.red },
            { label: "Masse salariale", val: euro(totalSal), color: G.gold },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 10, color: G.muted, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Graphique */}
      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 20, padding: "20px 20px 16px" }}>
        <div style={{ fontSize: 11, color: G.gold, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Évolution mensuelle</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 100 }}>
          {state.recettes.map((r, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 80 }}>
                <div style={{ flex: 1, borderRadius: "3px 3px 0 0", background: `linear-gradient(180deg, ${G.green}, ${G.green}44)`, height: `${(r.ca / maxCA) * 80}px`, transition: "height 0.6s ease" }} />
                <div style={{ flex: 1, borderRadius: "3px 3px 0 0", background: `linear-gradient(180deg, ${G.red}, ${G.red}44)`, height: `${(r.dep / maxCA) * 80}px`, transition: "height 0.6s ease" }} />
              </div>
              <div style={{ fontSize: 10, color: G.muted, fontWeight: 600 }}>{r.mois}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          {[{ c: G.green, l: "CA" }, { c: G.red, l: "Dépenses" }].map((x, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: G.muted }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: x.c }} /> {x.l}
            </div>
          ))}
        </div>
      </div>

      {/* Alertes */}
      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 20, padding: 20 }}>
        <div style={{ fontSize: 11, color: G.gold, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>🤖 Analyse IA</div>
        {[
          { icon: "⚠️", msg: "Dépenses fournisseurs élevées. Renégociation conseillée.", color: G.gold },
          { icon: "📈", msg: `CA en hausse de +${Math.round(((ca - 29800) / 29800) * 100)}% vs mars. Excellente dynamique.`, color: G.green },
          { icon: "💡", msg: "L'entrecôte frites génère 67% de marge. Mettez-la en avant.", color: G.blue },
        ].map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 2 ? `1px solid ${G.border}` : "none" }}>
            <span>{a.icon}</span>
            <span style={{ fontSize: 13, color: G.mutedLight, lineHeight: 1.5 }}>{a.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DepensesScreen({ state, setState }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ label: "", montant: "", categorie: "fournisseurs" });
  const total = state.depenses.reduce((s, d) => s + d.montant, 0);

  const add = () => {
    if (!form.label || !form.montant) return;
    setState(s => ({ ...s, depenses: [...s.depenses, { id: Date.now(), ...form, montant: parseFloat(form.montant), date: new Date().toISOString().split("T")[0] }] }));
    setForm({ label: "", montant: "", categorie: "fournisseurs" });
    setShow(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: G.text, letterSpacing: "-0.5px" }}>Dépenses</div>
          <div style={{ fontSize: 13, color: G.muted, marginTop: 2 }}>Total : {euro(total)}</div>
        </div>
        <button onClick={() => setShow(true)} style={{
          background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
          color: "#000", border: "none", borderRadius: 14, padding: "10px 18px",
          fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
        }}>+ Ajouter</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {state.depenses.map(dep => {
          const cat = CATS[dep.categorie] || CATS.autres;
          return (
            <div key={dep.id} style={{
              background: G.card, border: `1px solid ${G.border}`,
              borderRadius: 16, padding: "14px 18px",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: cat.color + "18", border: `1px solid ${cat.color}33`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
              }}>{cat.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: G.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dep.label}</div>
                <div style={{ fontSize: 11, color: G.muted, marginTop: 2 }}>{dep.date} · {cat.label}</div>
              </div>
              <div style={{ fontWeight: 900, fontSize: 16, color: G.red, flexShrink: 0 }}>−{euro(dep.montant)}</div>
              <button onClick={() => setState(s => ({ ...s, depenses: s.depenses.filter(d => d.id !== dep.id) }))}
                style={{ background: "none", border: "none", cursor: "pointer", color: G.muted, fontSize: 15, padding: 0 }}>✕</button>
            </div>
          );
        })}
      </div>

      {show && (
        <div onClick={() => setShow(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: G.surface, borderTop: `1px solid ${G.goldBorder}`,
            borderRadius: "24px 24px 0 0", padding: "28px 24px 40px", width: "100%", maxWidth: 480,
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 4, background: G.border, margin: "0 auto 24px" }} />
            <div style={{ fontSize: 18, fontWeight: 900, color: G.text, marginBottom: 20 }}>Nouvelle dépense</div>
            {[
              { ph: "Description", key: "label", type: "text" },
              { ph: "Montant (€)", key: "montant", type: "number" },
            ].map(f => (
              <input key={f.key} type={f.type} placeholder={f.ph} value={form[f.key]}
                onChange={e => setForm(s => ({ ...s, [f.key]: e.target.value }))}
                style={{ width: "100%", background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: "13px 16px", fontSize: 14, color: G.text, outline: "none", fontFamily: "inherit", marginBottom: 12, boxSizing: "border-box" }} />
            ))}
            <select value={form.categorie} onChange={e => setForm(s => ({ ...s, categorie: e.target.value }))}
              style={{ width: "100%", background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: "13px 16px", fontSize: 14, color: G.text, outline: "none", fontFamily: "inherit", marginBottom: 20, boxSizing: "border-box" }}>
              {Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
            </select>
            <button onClick={add} style={{ width: "100%", background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`, color: "#000", border: "none", borderRadius: 14, padding: 16, fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EquipeScreen({ state, setState }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ nom: "", poste: "", salaire: "", statut: "CDI" });
  const total = state.employes.reduce((s, e) => s + e.salaire, 0);

  const add = () => {
    if (!form.nom || !form.salaire) return;
    setState(s => ({ ...s, employes: [...s.employes, { id: Date.now(), ...form, salaire: parseFloat(form.salaire) }] }));
    setForm({ nom: "", poste: "", salaire: "", statut: "CDI" });
    setShow(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: G.text, letterSpacing: "-0.5px" }}>Équipe</div>
          <div style={{ fontSize: 13, color: G.muted, marginTop: 2 }}>Masse salariale : {euro(total)}/mois</div>
        </div>
        <button onClick={() => setShow(true)} style={{ background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`, color: "#000", border: "none", borderRadius: 14, padding: "10px 18px", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+ Ajouter</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {state.employes.map(emp => (
          <div key={emp.id} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 18, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14,
                background: `linear-gradient(135deg, ${G.gold}33, ${G.gold}11)`,
                border: `1px solid ${G.goldBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 900, color: G.gold, flexShrink: 0,
              }}>{initials(emp.nom)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: G.text }}>{emp.nom}</div>
                <div style={{ fontSize: 12, color: G.muted, marginTop: 2 }}>{emp.poste}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Pill color={emp.statut === "CDI" ? G.green : G.gold}>{emp.statut}</Pill>
                <button onClick={() => setState(s => ({ ...s, employes: s.employes.filter(e => e.id !== emp.id) }))}
                  style={{ background: "none", border: "none", cursor: "pointer", color: G.muted, fontSize: 14 }}>✕</button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0 0", borderTop: `1px solid ${G.border}` }}>
              <span style={{ fontSize: 12, color: G.muted }}>Salaire mensuel</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: G.goldLight }}>{euro(emp.salaire)}</span>
            </div>
            <GoldBar value={emp.salaire} max={total} />
          </div>
        ))}
      </div>

      {show && (
        <div onClick={() => setShow(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: G.surface, borderTop: `1px solid ${G.goldBorder}`, borderRadius: "24px 24px 0 0", padding: "28px 24px 40px", width: "100%", maxWidth: 480 }}>
            <div style={{ width: 40, height: 4, borderRadius: 4, background: G.border, margin: "0 auto 24px" }} />
            <div style={{ fontSize: 18, fontWeight: 900, color: G.text, marginBottom: 20 }}>Nouvel employé</div>
            {[{ ph: "Nom complet", key: "nom" }, { ph: "Poste", key: "poste" }, { ph: "Salaire mensuel (€)", key: "salaire", type: "number" }].map(f => (
              <input key={f.key} type={f.type || "text"} placeholder={f.ph} value={form[f.key]}
                onChange={e => setForm(s => ({ ...s, [f.key]: e.target.value }))}
                style={{ width: "100%", background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: "13px 16px", fontSize: 14, color: G.text, outline: "none", fontFamily: "inherit", marginBottom: 12, boxSizing: "border-box" }} />
            ))}
            <select value={form.statut} onChange={e => setForm(s => ({ ...s, statut: e.target.value }))}
              style={{ width: "100%", background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: "13px 16px", fontSize: 14, color: G.text, outline: "none", fontFamily: "inherit", marginBottom: 20, boxSizing: "border-box" }}>
              {["CDI", "CDD", "Extra"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <button onClick={add} style={{ width: "100%", background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`, color: "#000", border: "none", borderRadius: 14, padding: 16, fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Enregistrer</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PlatsScreen({ state }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 900, color: G.text, letterSpacing: "-0.5px", marginBottom: 6 }}>Rentabilité</div>
      <div style={{ fontSize: 13, color: G.muted, marginBottom: 20 }}>Performance par plat</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {state.plats.sort((a, b) => (b.prix - b.cout) / b.prix - (a.prix - a.cout) / a.prix).map((plat, i) => {
          const marge = ((plat.prix - plat.cout) / plat.prix) * 100;
          const benef = (plat.prix - plat.cout) * plat.ventes;
          const color = marge > 60 ? G.green : marge > 40 ? G.gold : G.red;
          return (
            <div key={i} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 18, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: G.text, marginBottom: 4 }}>{plat.nom}</div>
                  <div style={{ fontSize: 12, color: G.muted }}>{plat.ventes} ventes · Prix {plat.prix}€ · Coût {plat.cout}€</div>
                </div>
                <Pill color={color}>{Math.round(marge)}%</Pill>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0 8px", borderTop: `1px solid ${G.border}` }}>
                <span style={{ fontSize: 12, color: G.muted }}>Bénéfice généré</span>
                <span style={{ fontSize: 20, fontWeight: 900, color }}>{euro(benef)}</span>
              </div>
              <GoldBar value={marge} max={100} color={color} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function IAScreen({ state }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: `Bonsoir. Je suis votre analyste financier IA dédié à **${state.nom}**. Comment puis-je vous aider aujourd'hui ?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const totalDep = state.depenses.reduce((s, d) => s + d.montant, 0);
  const totalSal = state.employes.reduce((s, e) => s + e.salaire, 0);
  const ca = state.recettes[state.recettes.length - 1]?.ca || 0;

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: msg }]);
    setLoading(true);

    const ctx = `Tu es un analyste financier expert, sobre et précis, pour le restaurant "${state.nom}".
Données : Budget ${state.budgetMensuel}€ | Dépenses ${totalDep}€ | Salaires ${totalSal}€ | CA ${ca}€ | ${state.employes.length} employés.
Dépenses : ${state.depenses.map(d => `${d.label} ${d.montant}€`).join(", ")}.
Plats : ${state.plats.map(p => `${p.nom} (marge ${Math.round(((p.prix - p.cout) / p.prix) * 100)}%)`).join(", ")}.
Réponds en français, de façon concise et actionnable. Max 3 phrases.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: ctx,
          messages: messages.concat({ role: "user", content: msg }).filter((m, i) => i > 0 || m.role !== "assistant").map(m => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", text: data.content?.map(b => b.text).join("") || "Erreur." }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", text: "Erreur de connexion." }]);
    }
    setLoading(false);
  };

  const suggestions = ["Où économiser ?", "Plat le plus rentable ?", "Analyse fournisseurs", "Réduire les charges"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)" }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: G.text, letterSpacing: "-0.5px", marginBottom: 4 }}>Assistant IA</div>
      <div style={{ fontSize: 13, color: G.muted, marginBottom: 16 }}>Analyse financière en temps réel</div>

      {messages.length === 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => setInput(s)} style={{ background: G.goldDim, border: `1px solid ${G.goldBorder}`, borderRadius: 20, padding: "7px 14px", fontSize: 12, color: G.gold, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>{s}</button>
          ))}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "82%",
              background: m.role === "user" ? `linear-gradient(135deg, ${G.gold}, ${G.goldLight})` : G.card,
              color: m.role === "user" ? "#000" : G.text,
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "12px 16px", fontSize: 14, lineHeight: 1.6,
              border: m.role === "assistant" ? `1px solid ${G.border}` : "none",
              fontWeight: m.role === "user" ? 700 : 400,
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 5, padding: "8px 14px", background: G.card, border: `1px solid ${G.border}`, borderRadius: "18px 18px 18px 4px", width: "fit-content" }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: G.gold, animation: `pulse 1.2s ease-in-out ${i * 0.3}s infinite` }} />)}
          </div>
        )}
        <div ref={ref} />
      </div>

      <div style={{ display: "flex", gap: 10, paddingTop: 12, borderTop: `1px solid ${G.border}` }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Votre question..."
          style={{ flex: 1, background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: "13px 16px", fontSize: 14, color: G.text, outline: "none", fontFamily: "inherit" }} />
        <button onClick={send} disabled={loading} style={{ background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`, border: "none", borderRadius: 14, padding: "13px 18px", fontSize: 16, cursor: "pointer", opacity: loading ? 0.5 : 1 }}>➤</button>
      </div>
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [state, setState] = useState(INIT);

  const tabs = [
    { id: "dashboard", icon: "◈", label: "Aperçu" },
    { id: "depenses", icon: "↓", label: "Dépenses" },
    { id: "equipe", icon: "◉", label: "Équipe" },
    { id: "plats", icon: "◆", label: "Plats" },
    { id: "ia", icon: "✦", label: "IA" },
  ];

  return (
    <div style={{ background: G.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "52px 24px 20px", borderBottom: `1px solid ${G.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: G.gold, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Gestion Financière IA</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: G.text, letterSpacing: "-0.5px" }}>🍽 {state.nom}</div>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: G.goldDim, border: `1px solid ${G.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚙️</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 20px 120px", overflowY: "auto" }}>
        {tab === "dashboard" && <DashboardScreen state={state} />}
        {tab === "depenses" && <DepensesScreen state={state} setState={setState} />}
        {tab === "equipe" && <EquipeScreen state={state} setState={setState} />}
        {tab === "plats" && <PlatsScreen state={state} />}
        {tab === "ia" && <IAScreen state={state} />}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: G.surface, borderTop: `1px solid ${G.border}`,
        display: "flex", padding: "12px 8px 24px",
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            border: "none", background: "none", cursor: "pointer", fontFamily: "inherit",
            color: tab === t.id ? G.gold : G.muted,
            transition: "color 0.2s",
          }}>
            <span style={{ fontSize: tab === t.id ? 22 : 18, transition: "font-size 0.2s" }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: G.gold }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
