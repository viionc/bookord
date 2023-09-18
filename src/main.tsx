// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";
import {FirebaseProvider} from "./context/FirebaseContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    //<React.StrictMode>
    <FirebaseProvider>
        <App />
    </FirebaseProvider>
    // </React.StrictMode>
);
