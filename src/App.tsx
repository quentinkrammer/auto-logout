import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [isAuthed, setIsAuthed] = useState(
    () => window.sessionStorage.getItem("isAuthed") === "true"
  );

  useEffect(() => {
    window.addEventListener("storage", function (e) {
      if (e.storageArea === sessionStorage) {
        console.log("Session storage changed:", e.key, e.oldValue, e.newValue);
      }
    });
  });

  function onLogin() {
    window.sessionStorage.setItem("isAuthed", "true");
    setIsAuthed(true);
  }

  function onLogout() {
    window.sessionStorage.setItem("isAuthed", "false");
    setIsAuthed(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {isAuthed ? (
        <button onClick={onLogout}>Logout</button>
      ) : (
        <button onClick={onLogin}>Login</button>
      )}

      <a target="_blank" href={import.meta.env.BASE_URL}>
        link to open in new tab
      </a>
    </div>
  );
}

export default App;
