import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Loading } from "./routes/index";
import "./styles/css/index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loading />} />
      </Routes>
    </Router>
  );
}

export default App;
