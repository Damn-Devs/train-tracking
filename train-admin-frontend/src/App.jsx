import Routers from "./routes/Router";
import { ToastContainer } from "react-toastify";
import "./App.css";

function App() {
  return (
    <div className="App select-none">
      <ToastContainer
        position="bottom-right"
        theme="colored"
        autoClose="3000"
      />
      <Routers />
    </div>
  );
}

export default App;
