import { useState } from "react";

const PLANS = [
  { name: "Free", price: "$0", limit: 3, badge: null },
  { name: "Creator", price: "$9/mo", limit: 999, badge: "🔥 Popular" },
  { name: "Agency", price: "$29/mo", limit: 999, badge: null },
];

const TABS = ["Analyzer", "Pricing", "About"];

function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#a78bfa", animation: `pulse 1.2s ${i * 0.2}s infinite`, display: "inline-block" }} />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
    </span>
  );
}

function ResultBlock({ label, content, accent }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div style={{ background: "#1a1a2e", border: `1px solid ${accent}33`, borderLeft: `3px solid ${accent}`, borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: accent, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
        <button onClick={copy} style={{ background: copied ? "#22c55e22" : "#ffffff11", border: `1px solid ${copied ? "#22c55e" : "#ffffff22"}`, borderRadius: 6, color: copied ? "#22c55e" : "#aaa", fontSize: 11, padding: "3px 10px", cursor: "pointer" }}>{copied ? "✓ Copied" : "Copy"}</button>
      </div>
      <p style={{ color: "#e2e8f0", fontSize: 13.5, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{content}</p>
    </div>
  );
}

function ScoreBar({ label, score, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ color: "#94a3b8", fontSize: 12 }}>{label}</span>
        <span style={{ color, fontWeight: 700, fontSize: 12 }}>{score}/100</span>
      </div>
      <div style={{ height: 5, background: "#1e293b", borderRadius: 99 }}>
        <div style={{ height: "100%", width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("Analyzer");
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [usageCount, setUsageCount] = useState(0);
  const [plan] = useState("Free");
  const freeLimit = 3;

  const analyze = async () => {
    if (!topic.trim()) return setError("Enter a video topic first.");
    if (plan === "Free" && usageCount >= freeLimit) { setError("Free limit reached. Upgrade to Creator plan."); return; }
    setError(""); setLoading(true); setResult(null);
    const prompt = `You are an expert YouTube SEO strategist. A creator has a video about: "${topic}"${niche ? ` in the niche: "${niche}"` : ""}. Generate a complete YouTube SEO package. Respond ONLY in this exact JSON format (no markdown, no extra text): {"title":"optimized YouTube title under 65 chars","description":"3-paragraph YouTube description","tags":["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8","tag9","tag10"],"hook":"first 15 seconds script hook","thumbnail_idea":"detailed thumbnail concept","scores":{"title_seo":85,"keyword_density":72,"click_potential":90,"competition_gap":68},"tips":["tip1","tip2","tip3"]}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }) });
      const data = await res.json();
      const text = data.content.map(b => b.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
      setUsageCount(c => c + 1);
    } catch { setError("AI analysis failed. Please try again."); }
    setLoading(false);
  };

  const scoreColors = { title_seo: "#a78bfa", keyword_density: "#38bdf8", click_potential: "#f472b6", competition_gap: "#34d399" };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f1f5f9", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #0f0f23, #1a1040)", borderBottom: "1px solid #ffffff0f", padding: "0 20px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>TubeRank AI</div>
                <div style={{ fontSize: 10, color: "#7c3aed", fontWeight: 600 }}>YouTube SEO Engine</div>
              </div>
            </div>
            <div style={{ background: "#1e1e3f", border: "1px solid #7c3aed44", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#c4b5fd" }}>{freeLimit - usageCount} free left</div>
          </div>
          <div style={{ display: "flex", marginTop: 16 }}>
            {TABS.map(t => (<button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", color: tab === t ? "#a78bfa" : "#64748b", fontWeight: tab === t ? 700 : 400, fontSize: 13, padding: "8px 16px", cursor: "pointer", borderBottom: tab === t ? "2px solid #7c3aed" : "2px solid transparent" }}>{t}</button>))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 20px" }}>
        {tab === "Analyzer" && (<>
          <div style={{ background: "linear-gradient(135deg, #1a0a3e, #0f1a3e)", border: "1px solid #7c3aed22", borderRadius: 16, padding: "24px 20px", marginBottom: 24, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🚀</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>AI YouTube SEO Optimizer</h1>
            <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>Generate viral titles, descriptions, tags & thumbnail ideas.</p>
          </div>
          <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Video Topic *</label>
            <input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze()} placeholder="e.g. How to rank YouTube videos in 2025" style={{ width: "100%", background: "#0d1117", border: "1.5px solid #1e293b", borderRadius: 10, padding: "12px 14px", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            <label style={{ display: "block", color: "#94a3b8", fontSize: 12, fontWeight: 600, marginBottom: 6, marginTop: 14 }}>Niche (optional)</label>
            <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. Gaming, Finance, Fitness..." style={{ width: "100%", background: "#0d1117", border: "1.5px solid #1e293b", borderRadius: 10, padding: "12px 14px", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            {error && <p style={{ color: "#f87171", fontSize: 12.5, margin: "10px 0 0", padding: "8px 12px", background: "#f8717122", borderRadius: 8 }}>{error}</p>}
            <button onClick={analyze} disabled
