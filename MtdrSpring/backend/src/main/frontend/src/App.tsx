import "./global.css";
import AppRouter from "./router/AppRouter";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <AppRouter />
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
