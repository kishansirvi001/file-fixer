
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));

      // ⏳ Auto redirect after 3 seconds (optional)
      setTimeout(() => {
        navigate("/image-compressor");
      }, 3000);
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          🎉 Welcome {user?.name || "User"}!
        </h1>

        <p style={styles.subtitle}>
          Your account has been created successfully 🚀
        </p>

        <button
          style={styles.button}
          onClick={() => navigate("/image-compressor")}
        >
          Go to Tools →
        </button>

        <p style={styles.redirectText}>
          Redirecting automatically...
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },

  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    width: "350px",
  },

  title: {
    fontSize: "26px",
    marginBottom: "10px",
    color: "#333",
  },

  subtitle: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "25px",
  },

  button: {
    background: "#667eea",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.3s",
  },

  redirectText: {
    marginTop: "15px",
    fontSize: "12px",
    color: "#999",
  },
};
