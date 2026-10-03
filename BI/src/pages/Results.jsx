import { useState } from "react"
import { useLocation } from "react-router-dom"

const BusinessIcon = ({ name }) => {
    const symbols = {
        phone: "call",
        email: "mail",
        website: "language",
        hours: "schedule",
        location: "location_on"
    }

    return <span aria-hidden="true" className="material-symbols-outlined business-icon">{symbols[name]}</span>
}

const Results=()=>{

const location = useLocation()
const data = location.state ?? {}
const businesses = Array.isArray(data.businesses) ? data.businesses : []

const [selectedCategory, setSelectedCategory] = useState("All")
const [mapBusiness, setMapBusiness] = useState(null)
const [searchInput, setSearchInput] = useState("")
const [searchTerm, setSearchTerm] = useState("")

const categories = ["All", "Websites", "No Websites", "Email", "Phone"]

const websiteBusinesses = businesses.filter((business) => business.website)
const phoneBusinesses = businesses.filter((business) => business.phone)
const emailBusinesses = businesses.filter((business) => business.email)

const noWebsite = businesses.filter(
    (business) => !business.website && (business.email || business.phone)
)

const categoryBusinesses = {
    All: businesses,
    Websites: websiteBusinesses,
    "No Websites": noWebsite,
    Email: emailBusinesses,
    Phone: phoneBusinesses
}[selectedCategory]

const filteredBusinesses = categoryBusinesses.filter((business) =>
    (business.name || "").toLowerCase().includes(searchTerm.trim().toLowerCase())
)

const getMapUrl = (business) => {
    const coordinates = business.coordinates
    const latitude = Number(business.latitude ?? business.lat ?? coordinates?.latitude ?? coordinates?.lat)
    const longitude = Number(business.longitude ?? business.lng ?? coordinates?.longitude ?? coordinates?.lng)
    const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude)
    const locationQuery = hasCoordinates
        ? `${latitude},${longitude}`
        : [business.name, business.address, business.city, business.location]
            .filter((value) => typeof value === "string" && value.trim())
            .join(", ")

    return `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&z=15&output=embed`
}

    return(
        <div className="results-page">
        
     

        <section className="results-subheader">

            <div>
                <h2> {data.total_businesses ?? businesses.length} </h2>
                <p>Total Businesses</p>
            </div>

            <div>
                <h2> {websiteBusinesses.length} </h2>
                <p>Website</p>
            </div>

            <div>
                <h2> {phoneBusinesses.length} </h2>
                <p>Phone</p>
            </div>

            <div>
                <h2> {emailBusinesses.length} </h2>
                <p>Email</p>
            </div>
        
        </section>

        <form
            className="results-search"
            onSubmit={(event) => {
                event.preventDefault()
                setSearchTerm(searchInput)
            }}
        >
            <input
                type="search"
                placeholder="Search by name"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
            />
            <button type="submit" className="btn-primary results-search-button"><p>Search</p></button>
        </form>

        <section className="categories-container">

            {categories.map((category)=>{
                return(

                    <button
                        key={category}
                        className={selectedCategory === category ? "selected" : ""}
                        onClick={() => setSelectedCategory(category)}
                    ><p>{category}</p></button>
                )
            })}

        </section>

        <section className={`results-content ${mapBusiness ? "map-open" : ""}`}>
            <div className="business-list">
                {filteredBusinesses.map((business, index) => (
                    <article
                        key={business.id ?? business.name ?? index}
                        className={`business-card ${selectedCategory.toLowerCase().replace(/\s+/g, "-")}-business-card`}
                    >
                        <div className="business-card-content">
                            <div className="business-list-header">
                                <span className="business-title">{business.name || "Unnamed business"}</span>
                                {business.category && <span className="business-category">{business.category}</span>}
                            </div>
                            <div className="business-card-details">
                                {business.phone && <span><BusinessIcon name="phone" />{business.phone}</span>}
                                {business.email && <span><BusinessIcon name="email" />{business.email}</span>}
                                {business.website && (
                                    <span>
                                        <BusinessIcon name="website" />
                                        <a href={/^https?:\/\//i.test(business.website) ? business.website : `https://${business.website}`} target="_blank" rel="noreferrer">
                                            {business.website}
                                        </a>
                                    </span>
                                )}
                                {business.opening_hours && <span><BusinessIcon name="hours" />{business.opening_hours}</span>}
                            </div>
                            <button type="button" className="btn-secondary map-button" onClick={() => setMapBusiness(business)}>
                                <BusinessIcon name="location" /> View on map
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {mapBusiness && (
                <aside className="business-map-panel">
                    <div className="business-map-header">
                        <h2>{mapBusiness.name || "Business location"}</h2>
                        <button type="button" className="map-close-button" onClick={() => setMapBusiness(null)} aria-label="Close map">
                            <span aria-hidden="true" className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <iframe
                        className="business-map"
                        title={`Map showing ${mapBusiness.name || "business location"}`}
                        src={getMapUrl(mapBusiness)}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </aside>
            )}
        </section>

            

        </div>
    )
}

export default Results