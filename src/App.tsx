import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddExpensePage from "./pages/AddExpensePage";
import Dock from "./components/Dock";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <BrowserRouter>
      <ThemeToggle />
      <main className="">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddExpensePage />} />
        </Routes>
      </main>
      <Dock />
    </BrowserRouter>
  );
}

export default App;
