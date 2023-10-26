import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SearchBar } from "./Components/SearchBar/SearchBar";
import { MapView } from "./Pages/MapView/MapView";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SearchBar />} />
          <Route path="/map" element={<MapView />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
