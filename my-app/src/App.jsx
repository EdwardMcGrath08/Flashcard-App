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
      <h1 style={styles.title}>Flashcards</h1>

      {card ? (
        <div style={styles.card} onClick={() => setShowAnswer((prev) => !prev)}>
          <p style={styles.cardText}>
            {showAnswer ? card.back : card.front}
          </p>
          <p style={styles.hint}>
            {showAnswer ? "Click to hide answer" : "Click to reveal answer"}
          </p>
        </div>
      ) : (
        <div style={styles.card}>
          <p style={styles.cardText}>Loading flashcards...</p>
        </div>
      )}

      {flashcards.length > 0 && (
        <p style={styles.counter}>
          Card {current + 1} of {flashcards.length}
        </p>
      )}

      <div style={styles.btnRow}>
        <button style={styles.btn} onClick={prev}>Previous</button>
        <button style={styles.btn} onClick={next}>Next</button>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    background: "#EEEDFE",
    borderRadius: "16px",
    padding: "2rem",
    minHeight: "340px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    fontFamily: "sans-serif",
  },
  title: {
    color: "#3C3489",
    fontSize: "22px",
    fontWeight: 500,
    margin: 0,
  },
  card: {
    background: "#fff",
    border: "1.5px solid #AFA9EC",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "480px",
    minHeight: "160px",
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
    color: "#3C3489",
    fontSize: "18px",
    fontWeight: 500,
  },
  hint: {
    margin: "12px 0 0",
    color: "#7F77DD",
    fontSize: "13px",
  },
  counter: {
    margin: 0,
    color: "#534AB7",
    fontSize: "13px",
  },
  btnRow: {
    display: "flex",
    gap: "12px",
  },
  btn: {
    background: "#7F77DD",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 500,
    padding: "0 22px",
    height: "38px",
    cursor: "pointer",
  },
};

export default App;