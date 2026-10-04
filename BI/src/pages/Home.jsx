import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const Home = ()=>{

    const [city,setCity]=useState("")
    const [category,setCategory]= useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const selectedLocation = useRef("")

    const navigate = useNavigate()

    useEffect(() => {
        const query = city.trim()
        if (selectedLocation.current) {
            const wasSelected = selectedLocation.current === query
            selectedLocation.current = ""
            if (wasSelected) {
                setSuggestions([])
                return
            }
        }

        if (query.length < 3) {
            setSuggestions([])
            return
        }

        const controller = new AbortController()
        const timeout = setTimeout(async () => {
            try {
                const params = new URLSearchParams({ q: query, limit: "5", lang: "en" })
                const response = await fetch(`https://photon.komoot.io/api/?${params}`, {
                    signal: controller.signal
                })
                if (!response.ok) return

                const data = await response.json()
                const results = (data.features ?? []).map((feature) => {
                    const properties = feature.properties ?? {}
                    const label = [...new Set([
                        properties.name || properties.city,
                        properties.state,
                        properties.country
                    ].filter(Boolean))].join(", ")

                    return {
                        id: `${properties.osm_type ?? "place"}-${properties.osm_id ?? label}`,
                        label
                    }
                }).filter((suggestion) => suggestion.label)

                setSuggestions(results)
            } catch (error) {
                if (error.name !== "AbortError") setSuggestions([])
            }
        }, 400)

        return () => {
            clearTimeout(timeout)
            controller.abort()
        }
    }, [city])

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (isLoading) return
        if (!city.trim() || !category.trim()) {
            setErrorMessage("Enter a location and business category.")
            return
        }

        setErrorMessage("")
        setIsLoading(true)
        const params = new URLSearchParams({
            city: city.trim(),
            category: category.trim()
        })
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 60_000)

        try {
            const response = await fetch(`https://business-intelligence-bg44.onrender.com/businesses/?${params}`, {
                signal: controller.signal
            })
            const data = await response.json()
            if (!response.ok) {
                if (response.status === 504 || /took too long|timed out/i.test(data.detail || "")) {
                    throw new Error("The search took too long. Please search again.")
                }
                throw new Error(data.detail || "Business search failed. Try again.")
            }

            if (Array.isArray(data.businesses) && data.businesses.length > 0) {
                navigate("/results", { state: data })
            } else {
                setErrorMessage("No businesses found. Try another location or category.")
            }
        } catch (error) {
            setErrorMessage(controller.signal.aborted
                ? "The search took too long. Please search again."
                : error.message || "Business search failed. Try again.")
        } finally {
            clearTimeout(timeout)
            setIsLoading(false)
        }
    }

    return(
        <div className="home-container">

            <section className="home-header">

                <h1>Discover Local Businesses</h1>
                
                <p className="header-description">Find and analyse businesses in any city. Get insights
                contact details and more - all in one place</p>

                
                <form className="home-search" onSubmit={handleSubmit}>
                    <div className="location-search">
                        <input
                            type="text"
                            value={city}
                            onChange={(event) => {
                                setCity(event.target.value)
                                setErrorMessage("")
                            }}
                            placeholder="Enter City Name"
                            className="city"
                            autoComplete="off"
                            role="combobox"
                            aria-autocomplete="list"
                            aria-expanded={suggestions.length > 0}
                            aria-controls="location-suggestions"
                        />
                        {suggestions.length > 0 && (
                            <div className="location-suggestions" id="location-suggestions" role="listbox">
                                {suggestions.map((suggestion) => (
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected="false"
                                        key={suggestion.id}
                                        onMouseDown={(event) => event.preventDefault()}
                                        onClick={() => {
                                            selectedLocation.current = suggestion.label
                                            setCity(suggestion.label)
                                            setSuggestions([])
                                            setErrorMessage("")
                                        }}
                                    >
                                        <span aria-hidden="true" className="material-symbols-outlined">location_on</span>
                                        {suggestion.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <input
                        type="text"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        placeholder="Business Category"
                        className="category"
                    />
                    <button
                        type="submit"
                        className="btn-primary search-button"
                        disabled={isLoading}
                        aria-busy={isLoading}
                        aria-label={isLoading ? "Searching for businesses" : "Search for businesses"}
                    >
                        {isLoading
                            ? <span className="loading-spinner" aria-hidden="true" />
                            : <span>Search</span>}
                    </button>
                </form>
                {errorMessage && (
                    <div className="search-error" role="alert">
                        <span aria-hidden="true" className="material-symbols-outlined">error</span>
                        <span>{errorMessage}</span>
                    </div>
                )}
                

                <section className="info">

                    <div>

                        <h1>
                            Location Search
                        </h1>
                        <p>
                            Find businesses in any<br/>
                             city using OpenStreetMap data
                        </p>
                    </div>

                    <div>

                           <h1>
                            Business Insights
                        </h1>
                        <p>
                            Get contact details,<br/>website info and more
                        </p>

                    </div>

                    <div>

                        <h1>
                            Live and Reliable
                        </h1>
                        <p>
                            Powered by FastApi, OverPass <br/>and live data sources
                        </p>

                    </div>
            


                </section>
            </section>
            
        </div>
    )
}

export default Home