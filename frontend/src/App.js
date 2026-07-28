import { AllRoutes } from "./routes/AllRoutes";
import { Navbar } from "./components/common/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Navbar />
      <AllRoutes />
      <Footer />
    </div>
  );
}

export default App;

