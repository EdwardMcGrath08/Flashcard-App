import { useState, useEffect } from 'react'
import './index.css'



const SHEET_URL = "https://script.google.com/macros/s/AKfycbwCRZPvCaXlVEF4Lbbv1IL4i1DGb9OFzDYYWWoBytWLc7tUmXQbBGdxTctKaGtmMpgg/exec"

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data.cards) throw new Error("No 'cards' field in response");
        const formatted = data.cards.map((row, index) => ({
          id: row.id || `card-${index + 1}`,
          front: row.front,
          back: row.back,
        }));
        setFlashcards(formatted);
      })
      .catch((err) => console.error("Error fetching flashcards:", err));
  }, []);

  const card = flashcards[current];
  const pad = (n) => String(n).padStart(2, '0');

  const next = () => {
    setShowAnswer(false);
    setCurrent((prev) => (prev + 1) % flashcards.length);
  };

  const prev = () => {
    setShowAnswer(false);
    setCurrent((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div style={styles.wrap}>
      <p style={styles.label}>// Neural uplink v2.0.7.7</p>
      <h1 style={styles.title}>Flashcards</h1>

      {card ? (
        <div style={styles.card} onClick={() => setShowAnswer((prev) => !prev)}>
          <p style={styles.cardText}>
            {showAnswer ? card.back : card.front}
          </p>
          <p style={styles.hint}>
            {showAnswer ? "[ tap to hide ]" : "[ tap to reveal ]"}
          </p>
        </div>
      ) : (
        <div style={styles.card}>
          <p style={styles.cardText}>Jacking in...</p>
        </div>
      )}

      {flashcards.length > 0 && (
        <p style={styles.counter}>
          CARD_{pad(current + 1)} / {pad(flashcards.length)}
        </p>
      )}

      <hr style={styles.divider} />

      <div style={styles.btnRow}>
        <button style={styles.btn} onClick={prev}>&#171; Prev</button>
        <button style={styles.btn} onClick={next}>Next &#187;</button>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    background: "#0d0d0f",
    border: "1px solid #FCE803",
    borderRadius: "4px",
    padding: "2rem",
    minHeight: "360px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    fontFamily: "'Rajdhani', sans-serif",
  },
  label: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "11px",
    color: "#00d4ff",
    letterSpacing: "3px",
    textTransform: "uppercase",
    margin: 0,
  },
  title: {
    color: "#FCE803",
    fontSize: "28px",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  card: {
    background: "#111114",
    border: "1px solid #FCE803",
    borderRadius: "2px",
    width: "100%",
    maxWidth: "480px",
    minHeight: "170px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    cursor: "pointer",
    textAlign: "center",
    boxSizing: "border-box",
  },
  cardText: {
    margin: 0,
    color: "#f0f0f0",
    fontSize: "20px",
    fontWeight: 500,
  },
  hint: {
    margin: "12px 0 0",
    color: "#00d4ff",
    fontSize: "12px",
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: "1px",
  },
  counter: {
    margin: 0,
    color: "#888",
    fontSize: "12px",
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: "2px",
  },
  divider: {
    width: "100%",
    maxWidth: "480px",
    border: "none",
    borderTop: "1px solid #222",
    margin: 0,
  },
  btnRow: {
    display: "flex",
    gap: "12px",
  },
  btn: {
    background: "#111114",
    border: "1px solid #FCE803",
    borderRadius: "2px",
    color: "#FCE803",
    fontSize: "13px",
    fontWeight: 700,
    fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: "2px",
    textTransform: "uppercase",
    padding: "0 24px",
    height: "40px",
    cursor: "pointer",
  },
};

export default App;