from fastapi import APIRouter, HTTPException
import httpx
from pydantic import BaseModel
from .ai_category import interpret_category

router = APIRouter()

url = "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
mapurl = "https://nominatim.openstreetmap.org/search"


class Business(BaseModel):
    id: int | None = None
    name: str | None = None
    category: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    phone: str | None = None
    email: str | None = None
    website: str | None = None
    opening_hours: str | None = None


class BusinessResponse(BaseModel):
    city: str
    category: str
    latitude: float
    longitude: float
    total_businesses: int
    businesses: list[Business]


@router.get("/", response_model=BusinessResponse)
async def location(city: str, category: str):

    async with httpx.AsyncClient(timeout=1000.0) as client:

        response = await client.get(
            mapurl,
            params={
                "q": city,
                "format": "jsonv2",
                "limit": 1
            },
            headers={
                "User-Agent": "BusinessIntelligenceApp/1.0"
            }
        )

        response.raise_for_status()

        location = response.json()

        if not location:
            raise HTTPException(
                status_code=404,
                detail=f"Could not find location: {city}"
            )

        city_latitude = float(location[0]["lat"])
        city_longitude = float(location[0]["lon"])

        category_data = interpret_category(category)

        osm_key = category_data["key"]
        osm_value = category_data["value"]

        print(category_data)

        query = f"""
        [out:json];

        (
            node["{osm_key}"="{osm_value}"](around:15000,{city_latitude},{city_longitude});
            way["{osm_key}"="{osm_value}"](around:15000,{city_latitude},{city_longitude});
            relation["{osm_key}"="{osm_value}"](around:15000,{city_latitude},{city_longitude});
        );

        out center;
        """

        new_response = await client.post(
            url,
            data={"data": query}
        )

        new_response.raise_for_status()

        businesses = new_response.json()

        elements = businesses["elements"]

        print(len(elements))

        clean_businesses = []

        for element in elements:

            tags = element.get("tags", {})

            if element["type"] == "node":
                business_latitude = element.get("lat")
                business_longitude = element.get("lon")
            else:
                center = element.get("center", {})
                business_latitude = center.get("lat")
                business_longitude = center.get("lon")

            business = Business(
                id=element.get("id"),
                name=tags.get("name"),
                category=tags.get("amenity"),
                latitude=business_latitude,
                longitude=business_longitude,
                phone=tags.get("phone"),
                email=tags.get("email"),
                website=tags.get("website"),
                opening_hours=tags.get("opening_hours")
            )

            clean_businesses.append(business)

    return BusinessResponse(
        city=city,
        category=category,
        latitude=city_latitude,
        longitude=city_longitude,
        total_businesses=len(clean_businesses),
        businesses=clean_businesses
    )


@router.get("/location")
async def businesses(
    city:str,
    category:str
):

    query = f"""
        [out:json];

       

       (
        node["amenity"="{category}"](around:15000,-22.5609,17.0658);
        way["amenity"="{category}"](around:15000,-22.5609,17.0658);
        relation["amenity"="{category}"](around:15000,-22.5609,17.0658);
    );

        out center;
        """

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:

            response = await client.post(
                url,
                data={"data": query},
                headers={
                    "Accept": "application/json"
                }
            )

            response.raise_for_status()

        return {
            "message": "businesses",
            "city": city,
            "category": category,
            "data": response.json()
        }

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Overpass API took too long to respond"
        )

    except httpx.HTTPStatusError as error:
        raise HTTPException(
            status_code=error.response.status_code,
            detail=f"Overpass API returned {error.response.status_code}"
        )