import Routers from "./routers/Routers";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        theme="colored"
        autoClose="3000"
      />
      <Routers />
    </>
  );
}

export default App;
