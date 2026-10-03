import json
import os

from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

MODEL = "Qwen/Qwen3-4B-Thinking-2507"
client = InferenceClient(token=os.getenv("HF_KEY") or os.getenv("HF_TOKEN"))

OVERPASS_CONTEXT = """
You are working with OpenStreetMap data through the Overpass API.

OpenStreetMap objects such as nodes, ways and relations contain tags.

A tag consists of:

key=value

Examples:

amenity=restaurant
amenity=cafe
amenity=bank
amenity=pharmacy

shop=clothes
shop=supermarket
shop=furniture
shop=shoes

tourism=hotel
tourism=museum

In Overpass QL, a tag can be searched using:

["key"="value"]

Examples:

node["amenity"="restaurant"];
node["shop"="clothes"];
node["tourism"="hotel"];

The same tag filter can be applied to node, way and relation.

For example:

(
    node["shop"="clothes"](around:15000,LAT,LON);
    way["shop"="clothes"](around:15000,LAT,LON);
    relation["shop"="clothes"](around:15000,LAT,LON);
);

out center;

Important:

The key and value must be actual OpenStreetMap tags.
Do not invent arbitrary key/value pairs.

The user's description may use natural language and does not
necessarily match the OSM tag.

Examples:

"clothing stores"
-> shop=clothes

"places to buy clothes"
-> shop=clothes

"places to eat"
-> amenity=restaurant

"coffee shops"
-> amenity=cafe

"places to buy groceries"
-> shop=supermarket

"places to stay"
-> tourism=hotel

"places to repair cars"
-> shop=car_repair
"""

SYSTEM_PROMPT = f"""
You are the category interpretation engine for a Business Intelligence
application.

The application receives natural-language business searches from users.

Your job is to translate the user's business description into the
most appropriate OpenStreetMap key/value pair.

{OVERPASS_CONTEXT}

Rules:

1. Return ONLY valid JSON.
2. Do not return Markdown.
3. Do not return an Overpass query.
4. Do not explain your answer.
5. Return exactly these fields:

{{
    "key": "string",
    "value": "string",
    "category": "string"
}}

6. "key" must be an OpenStreetMap tag key.
7. "value" must be an OpenStreetMap tag value.
8. "category" should be a short normalized description of the
   business type.
9. Never invent an OSM key/value pair.
10. Prefer a specific business tag when one exists.
11. Interpret synonyms, plurals and natural language.
12. The key/value pair must be suitable for direct insertion into:

["key"="value"]

Examples:

User:
clothing stores

Response:
{{
    "key": "shop",
    "value": "clothes",
    "category": "clothing"
}}

User:
places to eat

Response:
{{
    "key": "amenity",
    "value": "restaurant",
    "category": "restaurant"
}}

User:
coffee shops

Response:
{{
    "key": "amenity",
    "value": "cafe",
    "category": "cafe"
}}

User:
places where I can buy furniture

Response:
{{
    "key": "shop",
    "value": "furniture",
    "category": "furniture"
}}
"""


def interpret_category(user_input: str):
    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },
        {
            "role": "user",
            "content": user_input
        }
    ]

    response = client.chat_completion(
        model=MODEL,
        messages=messages,
        temperature=0,
        response_format={"type": "json_object"}
    )

    content = response.choices[0].message.content

    return json.loads(content)