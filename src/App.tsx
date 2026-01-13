import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [isAuthed, setIsAuthed] = useState(
    () => window.sessionStorage.getItem("isAuthed") === "true"
  );

  const [authChannel, _] = useState(new BroadcastChannel("auth_token"));
  // useEffect(() => {
  //   function onStorageChangeInDifferentTab(e: StorageEvent) {
  //     console.log("Session storage changed:", e.key, e.oldValue, e.newValue);
  //     if (e.storageArea === sessionStorage && e.key === "isAuthed") {
  //       window.sessionStorage.setItem(e.key, e.newValue ?? "");
  //       setIsAuthed(e.newValue === "true");
  //     }
  //   }

  //   window.addEventListener("storage", onStorageChangeInDifferentTab);
  //   console.log("onStorageChangeInDifferentTab registered");

  //   () => window.removeEventListener("storage", onStorageChangeInDifferentTab);
  // }, []);

  useEffect(() => {
    function onAuthChannelEvent(e: MessageEvent) {
      {
        const token = window.sessionStorage.getItem("isAuthed");

        switch (e.data.message) {
          case "NEW_TAB":
            console.log("auth_channel: NEW_TAB");
            if (token) {
              authChannel.postMessage({ message: "AUTH_TOKEN", token });
            }
            break;
          case "AUTH_TOKEN":
            console.log("auth_channel: AUTH_TOKEN");
            if (!token) {
              window.sessionStorage.setItem("isAuthed", e.data.token);
              setIsAuthed(window.sessionStorage.getItem("isAuthed") === "true");
            }
            break;
          case "SIGN_OUT":
            console.log("auth_channel: SIGN_OUT");
            window.sessionStorage.removeItem("token");
            setIsAuthed(window.sessionStorage.getItem("isAuthed") === "true");
        }
      }
    }

    authChannel.addEventListener("message", onAuthChannelEvent);

    authChannel.postMessage({ message: "NEW_TAB" });

    () => {
      authChannel.removeEventListener("message", onAuthChannelEvent);
    };
  }, []);

  function onLogin() {
    window.sessionStorage.setItem("isAuthed", "true");
    authChannel.postMessage({
      message: "AUTH_TOKEN",
      token: window.sessionStorage.getItem("isAuthed"),
    });
  }

  function onLogout() {
    window.sessionStorage.removeItem("isAuthed");
    authChannel.postMessage("SIGN_OUT");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {isAuthed ? (
        <button onClick={onLogout}>Logout</button>
      ) : (
        <button onClick={onLogin}>Login</button>
      )}

      <a target="_blank" rel="opener" href={import.meta.env.BASE_URL}>
        link to open in new tab
      </a>
    </div>
  );
}

export default App;
