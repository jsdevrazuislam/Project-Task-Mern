import AppRouter from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from 'sonner';
import { AuthProvider } from "./context/auth-context";

const App = () => {

const queryClient = new QueryClient();



  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  )
};

export default App;