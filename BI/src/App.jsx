import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./index.css"
import Home from "./pages/Home"
import About from "./pages/About"
import Results from "./pages/Results"
import AppLayout from "./layouts/AppLayout"

function App() {

    const layout = (page) => {
        return (
            <AppLayout>
                {page}
            </AppLayout>
        )
    }

    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={layout(<Home />)} />

                <Route path="/about" element={layout(<About />)} />

                <Route path="/results" element={layout(<Results />)} />

            </Routes>
        </BrowserRouter>
    )
}

export default App
