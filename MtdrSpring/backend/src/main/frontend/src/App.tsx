import "@/global.css";
import AppRouter from "@/router/AppRouter";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <AppRouter />
          </QueryClientProvider>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
