import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from products.models import Product, ProductImage, ProductVariant


def update_existing_models_and_subcategories():
    """Update existing imported products with subcategories and accurate 3D model URLs."""
    print("Updating existing products with model_3d_url and subcategories...")

    # 1. Footwear
    for p in Product.objects.filter(category="footwear"):
        name_lower = p.name.lower()
        if "cricket" in name_lower or "spike" in name_lower or "cover drive" in name_lower:
            p.model_3d_type = "cricket_shoe"
            p.model_3d_url = "/models/cricket_shoe.glb"
            p.sub_category = "Cricket Footwear"
        else:
            p.model_3d_type = "running_shoe"
            p.model_3d_url = "/models/running_shoe.glb"
            if "trail" in name_lower:
                p.sub_category = "Trail Running"
            elif "light" in name_lower or "nitro" in name_lower or "speed" in name_lower:
                p.sub_category = "Lightweight Running"
            else:
                p.sub_category = "Performance Running"
        p.save(update_fields=["model_3d_type", "model_3d_url", "sub_category"])

    # 2. Apparel
    for p in Product.objects.filter(category="apparel"):
        name_lower = p.name.lower()
        p.model_3d_type = "apparel"
        p.model_3d_url = "/models/tshirt.glb"
        if "polo" in name_lower or p.product_type.lower() == "polo":
            p.sub_category = "Polo T-shirts"
        elif "short" in name_lower or "shorts" in name_lower:
            p.sub_category = "Training Shorts"
        elif "track" in name_lower or "pant" in name_lower or "jogger" in name_lower:
            p.sub_category = "Track Pants & Joggers"
        elif "jacket" in name_lower or "hoodie" in name_lower or "sweatshirt" in name_lower:
            p.sub_category = "Jackets & Hoodies"
        else:
            p.sub_category = "Performance T-Shirts"
        p.save(update_fields=["model_3d_type", "model_3d_url", "sub_category"])

    # 3. Accessories
    for p in Product.objects.filter(category="accessories"):
        name_lower = p.name.lower()
        if "cap" in name_lower or "hat" in name_lower or p.product_type.lower() == "caps":
            p.model_3d_type = "cap"
            p.model_3d_url = "/models/cap.glb"
            p.sub_category = "Caps"
        elif "bottle" in name_lower or "flask" in name_lower:
            p.model_3d_type = "water_bottle"
            p.model_3d_url = "/models/water_bottle.glb"
            p.sub_category = "Water Bottles"
        elif "bat" in name_lower:
            p.model_3d_type = "cricket_bat"
            p.model_3d_url = "/models/cricket_bat.glb"
            p.sub_category = "Cricket Bats"
        elif "ball" in name_lower:
            p.model_3d_type = "cricket_ball"
            p.model_3d_url = "/models/cricket_ball.glb"
            p.sub_category = "Cricket Balls"
        elif "sock" in name_lower:
            p.model_3d_type = "none"
            p.model_3d_url = ""
            p.sub_category = "Socks"
        elif "bag" in name_lower or "backpack" in name_lower or "duffle" in name_lower:
            p.model_3d_type = "none"
            p.model_3d_url = ""
            p.sub_category = "Sports Bags"
        else:
            p.sub_category = "Accessories"
        p.save(update_fields=["model_3d_type", "model_3d_url", "sub_category"])

    print("Existing products updated.")


NEW_FEATURED_SPORTS_PRODUCTS = [
    # ----------------------------------------------------
    # RUNNING FOOTWEAR
    # ----------------------------------------------------
    {
        "name": "ONE8 Velocity Nitro 3 Performance Runner",
        "slug": "one8-velocity-nitro-3-performance-runner",
        "description": "Engineered for explosive energy return and ultra-responsive marathon comfort. Features Nitrogen-infused foam cushioning, engineered mono-mesh upper, and ONE8 high-traction rubber lug outsole.",
        "price": 10999.00,
        "sale_price": 8999.00,
        "category": "footwear",
        "product_type": "Running Shoe",
        "sub_category": "Performance Running",
        "image": "https://one8.com/cdn/shop/files/1_7b088663-8a39-4d69-be5a-1941fa4c13a0.jpg?v=1719574519",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_7b088663-8a39-4d69-be5a-1941fa4c13a0.jpg?v=1719574519",
            "https://one8.com/cdn/shop/files/2_ef2e5b47-640a-4712-9c17-4971c26f6345.jpg?v=1719574520",
            "https://one8.com/cdn/shop/files/3_e3845b46-0b80-496a-a2a4-db9cfefb7be0.jpg?v=1719574520",
            "https://one8.com/cdn/shop/files/4_6d5ad6bc-79bf-4809-bb43-be722f986420.jpg?v=1719574520",
        ],
        "is_featured": True,
        "is_available": True,
        "model_3d_type": "running_shoe",
        "model_3d_url": "/models/running_shoe.glb",
        "sku": "ONE8-RUN-VN3-BLK",
        "specifications": {
            "Cushioning": "Dual-density Nitrogen-infused NITRO foam",
            "Weight": "242 grams (UK 8)",
            "Heel-to-Toe Drop": "8 mm",
            "Upper": "Engineered breathable mono-mesh with 3M reflective accents",
            "Outsole": "PUMAGRIP high-traction compound",
            "Pronation": "Neutral",
            "Closure": "Asymmetrical lacing system",
        },
        "sizes": ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
        "colors": [
            {"name": "Stealth Black", "hex": "#171717"},
            {"name": "Sonic Cyan", "hex": "#00d2d3"},
            {"name": "Pure White", "hex": "#f5f5f2"},
        ],
    },
    {
        "name": "ONE8 Featherweight Cloud Racer",
        "slug": "one8-featherweight-cloud-racer",
        "description": "Minimalist ultra-light racing flat designed for tempo workouts and 10K racing. Ultra-thin translucent ripstop upper with carbon-infused propulsion plate for instantaneous toe-off.",
        "price": 8499.00,
        "sale_price": None,
        "category": "footwear",
        "product_type": "Running Shoe",
        "sub_category": "Lightweight Running",
        "image": "https://one8.com/cdn/shop/files/1_d2839d3c-9150-482a-9e1e-ea13a6839352.jpg?v=1719574516",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_d2839d3c-9150-482a-9e1e-ea13a6839352.jpg?v=1719574516",
            "https://one8.com/cdn/shop/files/2_5806c9bc-69cb-4c55-a5d5-8f6580f4f727.jpg?v=1719574516",
            "https://one8.com/cdn/shop/files/3_498ec5b0-dfa8-49bc-8874-9f449339e1e9.jpg?v=1719574516",
        ],
        "is_featured": True,
        "is_available": True,
        "model_3d_type": "running_shoe",
        "model_3d_url": "/models/running_shoe.glb",
        "sku": "ONE8-RUN-FWC-WHT",
        "specifications": {
            "Weight": "188 grams",
            "Cushioning": "Supercritical Pebax foam",
            "Drop": "6 mm",
            "Plate": "Full-length carbon composite plate",
        },
        "sizes": ["UK 7", "UK 8", "UK 9", "UK 10"],
        "colors": [
            {"name": "Chalk White", "hex": "#f8f9fa"},
            {"name": "Onyx Black", "hex": "#212529"},
        ],
    },
    {
        "name": "ONE8 All-Terrain Trail Apex",
        "slug": "one8-all-terrain-trail-apex",
        "description": "Built to conquer rugged dirt trails, rocky ascents, and gravel paths. Reinforced toe bumper shield, water-resistant DWR coating, and aggressive 5mm multi-directional chevron lugs.",
        "price": 9999.00,
        "sale_price": 7999.00,
        "category": "footwear",
        "product_type": "Running Shoe",
        "sub_category": "Trail Running",
        "image": "https://one8.com/cdn/shop/files/1_25e4c0ba-6932-4d10-8b01-523e6587c4f4.jpg?v=1719574522",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_25e4c0ba-6932-4d10-8b01-523e6587c4f4.jpg?v=1719574522",
            "https://one8.com/cdn/shop/files/2_22c3e1e9-9be9-4503-a1c1-4bfa1e6bc1fa.jpg?v=1719574523",
        ],
        "is_featured": False,
        "is_available": True,
        "model_3d_type": "running_shoe",
        "model_3d_url": "/models/running_shoe.glb",
        "sku": "ONE8-TRAIL-APX",
        "specifications": {
            "Lug Depth": "5.0 mm multi-angle lugs",
            "Upper": "Ballistic mesh with TPU welded mudguards",
            "Waterproofing": "DWR moisture-repellent finish",
        },
        "sizes": ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
        "colors": [
            {"name": "Deep Olive", "hex": "#3b4d3c"},
            {"name": "Matte Charcoal", "hex": "#2c3e50"},
        ],
    },
    {
        "name": "ONE8 Strider Daily Training Shoe",
        "slug": "one8-strider-daily-training-shoe",
        "description": "The quintessential daily workhorse engineered for everyday 5K to 15K training runs. Plush dual-layer EVA foam bed, padded heel counter, and durable blown rubber crash pad.",
        "price": 6999.00,
        "sale_price": None,
        "category": "footwear",
        "product_type": "Running Shoe",
        "sub_category": "Daily Training",
        "image": "https://one8.com/cdn/shop/files/1_3a598aa2-94b6-455b-b9f1-bc8499268f76.jpg?v=1719574517",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_3a598aa2-94b6-455b-b9f1-bc8499268f76.jpg?v=1719574517",
            "https://one8.com/cdn/shop/files/2_0dc82ea8-b800-4b2a-a92c-6238b9dd5544.jpg?v=1719574518",
        ],
        "is_featured": False,
        "is_available": True,
        "model_3d_type": "running_shoe",
        "model_3d_url": "/models/running_shoe.glb",
        "sku": "ONE8-STR-DLY",
        "specifications": {
            "Cushioning": "CloudComfort Dual EVA",
            "Drop": "10 mm",
            "Weight": "265 grams",
        },
        "sizes": ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
        "colors": [
            {"name": "Triple Grey", "hex": "#6c757d"},
            {"name": "Core Black", "hex": "#111111"},
        ],
    },

    # ----------------------------------------------------
    # CRICKET FOOTWEAR
    # ----------------------------------------------------
    {
        "name": "ONE8 Cover Drive 18 X Gold Spikes",
        "slug": "one8-cover-drive-18x-gold-spikes",
        "description": "Virat Kohli's premier international match spike. 11-spike configuration featuring titanium replaceable spikes on a torsion-stiffened TPU chassis, reinforced toe drag box for express pace, and 3D molded heel cup.",
        "price": 14999.00,
        "sale_price": 12999.00,
        "category": "footwear",
        "product_type": "Cricket Spikes",
        "sub_category": "Cricket Spikes",
        "image": "/images/cover-drive-18x.jpeg",
        "gallery": [
            "/images/cover-drive-18x.jpeg",
            "https://one8.com/cdn/shop/files/1_7b088663-8a39-4d69-be5a-1941fa4c13a0.jpg?v=1719574519",
        ],
        "is_featured": True,
        "is_available": True,
        "model_3d_type": "cricket_shoe",
        "model_3d_url": "/models/cricket_shoe.glb",
        "sku": "ONE8-CRK-CD18X",
        "specifications": {
            "Spike Setup": "11-Spike Configuration (7 forefoot, 4 heel) with key included",
            "Upper": "Water-repellent microfiber synthetic leather with abrasion overlay",
            "Toe Protection": "Reinforced molded rubber toe cap for heavy drag",
            "Midsole": "High-rebound shock absorber foam",
            "Outsole": "Rigid TPU torsion plate with flex grooves",
            "Weight": "385 grams (UK 8)",
        },
        "sizes": ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
        "colors": [
            {"name": "Match White / Gold", "hex": "#f5f5f2"},
            {"name": "Stealth Black / Gold", "hex": "#1a1a1a"},
        ],
    },
    {
        "name": "ONE8 Century Turf Pro Trainer",
        "slug": "one8-century-turf-pro-trainer",
        "description": "Engineered for net practice, artificial turf pitches, and hard training wickets. Multidirectional rubber stud traction grid with full-length EVA midsole for hours of continuous impact absorption.",
        "price": 7999.00,
        "sale_price": None,
        "category": "footwear",
        "product_type": "Cricket Training Shoe",
        "sub_category": "Cricket Training Shoes",
        "image": "https://one8.com/cdn/shop/files/1_794b150c-e2f4-411d-8758-c2b64efad3d1.jpg?v=1719574517",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_794b150c-e2f4-411d-8758-c2b64efad3d1.jpg?v=1719574517",
            "https://one8.com/cdn/shop/files/2_cd14bf39-42b7-4c47-8cfd-e18cfbf64177.jpg?v=1719574517",
        ],
        "is_featured": False,
        "is_available": True,
        "model_3d_type": "cricket_shoe",
        "model_3d_url": "/models/cricket_shoe.glb",
        "sku": "ONE8-CRK-CTP",
        "specifications": {
            "Surface": "Artificial turf, indoor mats, hard dirt practice wickets",
            "Traction": "Dimpled rubber multidirectional turf studs",
            "Upper": "Breathable mesh with synthetic support cage",
        },
        "sizes": ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
        "colors": [
            {"name": "White / Navy", "hex": "#ffffff"},
            {"name": "All Black", "hex": "#171717"},
        ],
    },
    {
        "name": "ONE8 All-Rounder Precision Spike",
        "slug": "one8-all-rounder-precision-spike",
        "description": "The ultimate versatile shoe for batting, bowling, and rapid boundary fielding. Convertible sole accommodates metal spikes or rubber studs based on pitch hardness.",
        "price": 11499.00,
        "sale_price": 9999.00,
        "category": "footwear",
        "product_type": "All-Round Cricket Shoe",
        "sub_category": "All-round Cricket Shoes",
        "image": "https://one8.com/cdn/shop/files/1_d758f1f4-3486-4f40-9a03-7cb7aa5b1e6e.jpg?v=1719574521",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_d758f1f4-3486-4f40-9a03-7cb7aa5b1e6e.jpg?v=1719574521",
        ],
        "is_featured": True,
        "is_available": True,
        "model_3d_type": "cricket_shoe",
        "model_3d_url": "/models/cricket_shoe.glb",
        "sku": "ONE8-CRK-ARP",
        "specifications": {
            "Configuration": "Hybrid 7/4 interchangeable stud/spike system",
            "Ankle Support": "Ergonomic padded collar with lockdown strap",
        },
        "sizes": ["UK 8", "UK 9", "UK 10", "UK 11"],
        "colors": [
            {"name": "Pure White / Gold", "hex": "#fafafa"},
        ],
    },

    # ----------------------------------------------------
    # SPORTSWEAR & APPAREL
    # ----------------------------------------------------
    {
        "name": "ONE8 Seamless Aero Dry Performance Tee",
        "slug": "one8-seamless-aero-dry-performance-tee",
        "description": "Engineered seamless circular-knit construction eliminates chafing during intense training sessions. Micro-ventilation body mapping zones ensure optimum airflow across back and underarms.",
        "price": 2499.00,
        "sale_price": 1999.00,
        "category": "apparel",
        "product_type": "Performance T-Shirt",
        "sub_category": "Performance T-Shirts",
        "image": "https://one8.com/cdn/shop/files/1_e528b1ba-192a-4db3-9cfd-cf01306fbc3a.jpg?v=1719575128",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_e528b1ba-192a-4db3-9cfd-cf01306fbc3a.jpg?v=1719575128",
            "https://one8.com/cdn/shop/files/2_40e3aa00-848e-4f7f-a698-c11ccbb7d11f.jpg?v=1719575129",
            "https://one8.com/cdn/shop/files/3_48ca5d76-f89a-4f51-b062-8bf10ae4df9e.jpg?v=1719575129",
        ],
        "is_featured": True,
        "is_available": True,
        "model_3d_type": "apparel",
        "model_3d_url": "/models/tshirt.glb",
        "sku": "ONE8-APP-AEROTEE",
        "specifications": {
            "Material": "88% Recycled Poly, 12% Elastane with dryCELL moisture wicking",
            "Fit": "Athletic Slim Fit",
            "Technology": "Anti-odor silver ion antimicrobial treatment",
            "Care": "Machine wash cold inside out, line dry",
        },
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": [
            {"name": "Triple Black", "hex": "#111111"},
            {"name": "Lunar White", "hex": "#f5f5f5"},
            {"name": "Sonic Navy", "hex": "#1a2a3a"},
        ],
    },
    {
        "name": "ONE8 Flex Pro 7-Inch Training Shorts",
        "slug": "one8-flex-pro-7-inch-training-shorts",
        "description": "Ultra-flexible 4-way stretch woven shorts with built-in compression liner, zippered water-resistant side pockets, and laser-perforated back waistband for heat dissipation.",
        "price": 2799.00,
        "sale_price": 2299.00,
        "category": "apparel",
        "product_type": "Training Shorts",
        "sub_category": "Training Shorts",
        "image": "https://one8.com/cdn/shop/files/1_e6a646c5-47d0-4581-81d3-be6eb329a272.jpg?v=1719575440",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_e6a646c5-47d0-4581-81d3-be6eb329a272.jpg?v=1719575440",
            "https://one8.com/cdn/shop/files/2_40576359-cb31-4dd9-a5ae-e28325752319.jpg?v=1719575440",
        ],
        "is_featured": False,
        "is_available": True,
        "model_3d_type": "apparel",
        "model_3d_url": "/models/tshirt.glb",
        "sku": "ONE8-APP-FLX7",
        "specifications": {
            "Inseam": "7 inches",
            "Waistband": "Flat elastic drawcord with silicone grip",
            "Pockets": "Two concealed zip pockets + phone sleeve",
        },
        "sizes": ["S", "M", "L", "XL"],
        "colors": [
            {"name": "Jet Black", "hex": "#171717"},
            {"name": "Gunmetal Grey", "hex": "#4a4a4a"},
        ],
    },
    {
        "name": "ONE8 Precision Tracksuit Set",
        "slug": "one8-precision-tracksuit-set",
        "description": "Two-piece premium athletic tracksuit featuring tailored jacket with ribbed collar and articulated tapered track pants. Minimalist tonal ONE8 silicone branding on left chest and thigh.",
        "price": 6999.00,
        "sale_price": 5499.00,
        "category": "apparel",
        "product_type": "Tracksuit",
        "sub_category": "Tracksuits",
        "image": "https://one8.com/cdn/shop/files/1_8bf4bf66-b328-4443-85d7-e070c793fffa.jpg?v=1719575317",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_8bf4bf66-b328-4443-85d7-e070c793fffa.jpg?v=1719575317",
            "https://one8.com/cdn/shop/files/2_a7b2cb1e-7f7f-4c5c-8973-2e0617ad340e.jpg?v=1719575317",
        ],
        "is_featured": True,
        "is_available": True,
        "model_3d_type": "apparel",
        "model_3d_url": "/models/tshirt.glb",
        "sku": "ONE8-APP-PTS",
        "specifications": {
            "Fabric": "Bonded double-knit technical fleece",
            "Zippers": "YKK matte black reverse-coil zippers",
        },
        "sizes": ["M", "L", "XL", "XXL"],
        "colors": [
            {"name": "Midnight Black", "hex": "#141414"},
            {"name": "Heather Grey", "hex": "#888888"},
        ],
    },
    {
        "name": "ONE8 Fleece Stealth Zip Hoodie",
        "slug": "one8-fleece-stealth-zip-hoodie",
        "description": "Heavyweight 380 GSM French Terry cotton hoodie with crossover thermal hood, ergonomic raglan sleeves, and custom gold-tipped drawcords.",
        "price": 4999.00,
        "sale_price": 3999.00,
        "category": "apparel",
        "product_type": "Hoodie",
        "sub_category": "Jackets & Hoodies",
        "image": "https://one8.com/cdn/shop/files/1_3c683369-0bc9-4b68-bf1b-c74ad3286f9f.jpg?v=1719575319",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_3c683369-0bc9-4b68-bf1b-c74ad3286f9f.jpg?v=1719575319",
            "https://one8.com/cdn/shop/files/2_b99e71ec-d766-4e58-9a67-0c14c51483ce.jpg?v=1719575320",
        ],
        "is_featured": True,
        "is_available": True,
        "model_3d_type": "apparel",
        "model_3d_url": "/models/tshirt.glb",
        "sku": "ONE8-APP-HDIE",
        "specifications": {
            "Weight": "380 GSM Heavyweight French Terry",
            "Hardware": "Matte black double zip with metallic gold pulls",
        },
        "sizes": ["S", "M", "L", "XL"],
        "colors": [
            {"name": "Stealth Black", "hex": "#1a1a1a"},
            {"name": "Chalk Oatmeal", "hex": "#e5e5e0"},
        ],
    },
    {
        "name": "ONE8 StormShield Sports Shell Jacket",
        "slug": "one8-stormshield-sports-shell-jacket",
        "description": "Engineered for harsh outdoor weather. Windproof, 10,000mm hydrostatic head waterproof membrane with taped critical seams and packable hood system.",
        "price": 5999.00,
        "sale_price": 4799.00,
        "category": "apparel",
        "product_type": "Sports Jacket",
        "sub_category": "Jackets & Hoodies",
        "image": "https://one8.com/cdn/shop/files/1_e962808c-9c7a-4089-ae33-b26a635073e5.jpg?v=1719575318",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_e962808c-9c7a-4089-ae33-b26a635073e5.jpg?v=1719575318",
        ],
        "is_featured": False,
        "is_available": True,
        "model_3d_type": "apparel",
        "model_3d_url": "/models/tshirt.glb",
        "sku": "ONE8-APP-STORM",
        "specifications": {
            "Rating": "10K / 10K Waterproof / Breathable",
            "Weight": "290 grams packable",
        },
        "sizes": ["M", "L", "XL"],
        "colors": [
            {"name": "Obsidian Black", "hex": "#0d0d0d"},
        ],
    },

    # ----------------------------------------------------
    # ACCESSORIES & CRICKET EQUIPMENT
    # ----------------------------------------------------
    {
        "name": "ONE8 Virat Kohli Signature Player Willow Bat",
        "slug": "one8-virat-kohli-signature-player-willow-bat",
        "description": "Handcrafted from pristine Grade 1+ English Willow selected by master craftsmen to replicate Virat Kohli's exact bat specifications. Massive edges (39-41mm), imposing mid-to-low power swell, duckbill profile for sublime balance, and 12-piece cane handle with chevron grip.",
        "price": 48999.00,
        "sale_price": 42999.00,
        "category": "accessories",
        "product_type": "Cricket Bat",
        "sub_category": "Cricket Bats",
        "image": "https://one8.com/cdn/shop/files/1_d758f1f4-3486-4f40-9a03-7cb7aa5b1e6e.jpg?v=1719574521",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_d758f1f4-3486-4f40-9a03-7cb7aa5b1e6e.jpg?v=1719574521",
        ],
        "is_featured": True,
        "is_available": True,
        "model_3d_type": "cricket_bat",
        "model_3d_url": "/models/cricket_bat.glb",
        "sku": "ONE8-EQP-VK18BAT",
        "specifications": {
            "Willow Grade": "Unbleached Hand-selected Grade 1+ English Willow (8+ straight grains)",
            "Edge Thickness": "40 mm power edges",
            "Spine Profile": "Full spine profile with minimal concaving",
            "Balance & Pickup": "Featherlight pickup engineered for rapid hand speed",
            "Handle": "Semi-oval 12-piece Sarawak cane handle with cork dampening",
            "Toe": "Fitted with factory toe guard and anti-scuff sheet",
            "Weight": "2 lbs 8.5 oz (approx 1150g)",
        },
        "sizes": ["Short Handle (Senior)", "Harrow"],
        "colors": [
            {"name": "Natural Willow / Gold", "hex": "#deb887"},
        ],
    },
    {
        "name": "ONE8 Red County Match Leather Cricket Ball (Box of 2)",
        "slug": "one8-red-county-match-leather-ball-box-of-2",
        "description": "Four-piece alum tanned top-grade steer hide leather ball. Hand-stitched with over 80 fine linen stitches for prominent seam integrity, durable lacquer shine, and prolonged reverse swing capabilities.",
        "price": 2499.00,
        "sale_price": None,
        "category": "accessories",
        "product_type": "Cricket Ball",
        "sub_category": "Cricket Balls",
        "image": "https://one8.com/cdn/shop/files/1_794b150c-e2f4-411d-8758-c2b64efad3d1.jpg?v=1719574517",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_794b150c-e2f4-411d-8758-c2b64efad3d1.jpg?v=1719574517",
        ],
        "is_featured": True,
        "is_available": True,
        "model_3d_type": "cricket_ball",
        "model_3d_url": "/models/cricket_ball.glb",
        "sku": "ONE8-EQP-BALL-RED2",
        "specifications": {
            "Construction": "4-Piece Premium Steer Hide Leather",
            "Core": "Compressed natural cork and worsted wool core",
            "Seam": "80+ hand-stitched linen seam threads",
            "Weight": "156 grams (Senior Regulation)",
        },
        "sizes": ["Men Regulation (156g)"],
        "colors": [
            {"name": "Match Red", "hex": "#8b0000"},
            {"name": "White Day/Night", "hex": "#f8f9fa"},
        ],
    },
    {
        "name": "ONE8 Signature Performance Cap",
        "slug": "one8-signature-performance-cap",
        "description": "Structured 6-panel athletic cap crafted from breathable micro-twill fabric with internal moisture-wicking sweatband, pre-curved visor, and signature 3D embroidered ONE8 metallic emblem.",
        "price": 1499.00,
        "sale_price": 1199.00,
        "category": "accessories",
        "product_type": "Caps",
        "sub_category": "Caps",
        "image": "https://one8.com/cdn/shop/files/1_7c78aa65-0205-4f7f-ad8e-8a03caad9a95.jpg?v=1719575510",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_7c78aa65-0205-4f7f-ad8e-8a03caad9a95.jpg?v=1719575510",
            "https://one8.com/cdn/shop/files/2_11fe0776-3fa7-4f81-9b19-216cfdc5f0f3.jpg?v=1719575510",
        ],
        "is_featured": True,
        "is_available": True,
        "model_3d_type": "cap",
        "model_3d_url": "/models/cap.glb",
        "sku": "ONE8-ACC-CAP-SIG",
        "specifications": {
            "Material": "100% Breathable Tech Cotton Twill",
            "Closure": "Adjustable matte metal buckle backstrap",
            "Emroidery": "3D High-density metallic ONE8 monogram",
        },
        "sizes": ["One Size (Adjustable)"],
        "colors": [
            {"name": "Jet Black / Gold", "hex": "#111111"},
            {"name": "Optic White / Black", "hex": "#f5f5f5"},
        ],
    },
    {
        "name": "ONE8 Insulated Stainless Steel 750ml Hydration Flask",
        "slug": "one8-insulated-stainless-steel-750ml-hydration-flask",
        "description": "Double-wall vacuum-insulated 18/8 food-grade pro stainless steel sports bottle. Keeps cold beverages ice-cold for 24 hours or hot for 12 hours. Sweat-free powder-coat finish with leak-proof sports chug cap.",
        "price": 1899.00,
        "sale_price": 1499.00,
        "category": "accessories",
        "product_type": "Water Bottles",
        "sub_category": "Water Bottles",
        "image": "https://one8.com/cdn/shop/files/1_3a598aa2-94b6-455b-b9f1-bc8499268f76.jpg?v=1719574517",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_3a598aa2-94b6-455b-b9f1-bc8499268f76.jpg?v=1719574517",
        ],
        "is_featured": True,
        "is_available": True,
        "model_3d_type": "water_bottle",
        "model_3d_url": "/models/water_bottle.glb",
        "sku": "ONE8-ACC-BTL-750",
        "specifications": {
            "Capacity": "750 ml (25.4 oz)",
            "Insulation": "TempShield Double-Wall Vacuum Insulation (24h Cold / 12h Hot)",
            "Material": "Pro-Grade 18/8 Stainless Steel, BPA-Free & Phthalate-Free",
            "Finish": "Slip-free textured powder coat",
        },
        "sizes": ["750 ml"],
        "colors": [
            {"name": "Stealth Black", "hex": "#1a1a1a"},
            {"name": "Brushed Chrome", "hex": "#d3d3d3"},
        ],
    },
    {
        "name": "ONE8 Tour Pro Cricket Wheelie Sports Duffle Bag",
        "slug": "one8-tour-pro-cricket-wheelie-sports-duffle-bag",
        "description": "Touring-standard sports wheelie duffle bag built from heavy-duty 1680D ballistic nylon. Features internal padded 3-bat compartment, separate ventilated footwear tunnel, helmet garage, and all-terrain heavy-duty tractor wheels.",
        "price": 8999.00,
        "sale_price": 7499.00,
        "category": "accessories",
        "product_type": "Sports Bags",
        "sub_category": "Sports Bags",
        "image": "https://one8.com/cdn/shop/files/1_7b088663-8a39-4d69-be5a-1941fa4c13a0.jpg?v=1719574519",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_7b088663-8a39-4d69-be5a-1941fa4c13a0.jpg?v=1719574519",
        ],
        "is_featured": False,
        "is_available": True,
        "model_3d_type": "none",
        "model_3d_url": "",
        "sku": "ONE8-ACC-BAG-TRP",
        "specifications": {
            "Volume": "130 Litres",
            "Dimensions": "98cm x 40cm x 42cm",
            "Material": "1680D Ballistic Waterproof Poly",
            "Features": "3-Bat Padded Sleeves, Ventilated Shoe Garage, Heavy Tractor Wheels",
        },
        "sizes": ["Full Size Tour (130L)"],
        "colors": [
            {"name": "Black / Trophy Gold", "hex": "#111111"},
        ],
    },
    {
        "name": "ONE8 High-Cushion Ankle Grip Socks (Pack of 3)",
        "slug": "one8-high-cushion-ankle-grip-socks-pack-of-3",
        "description": "Ergonomically engineered athletic socks featuring anatomical left/right arch compression band, high-density terry cushioning under heel and ball of foot, and moisture-wicking CoolMax yarn.",
        "price": 799.00,
        "sale_price": None,
        "category": "accessories",
        "product_type": "Socks",
        "sub_category": "Socks",
        "image": "https://one8.com/cdn/shop/files/1_d2839d3c-9150-482a-9e1e-ea13a6839352.jpg?v=1719574516",
        "gallery": [
            "https://one8.com/cdn/shop/files/1_d2839d3c-9150-482a-9e1e-ea13a6839352.jpg?v=1719574516",
        ],
        "is_featured": False,
        "is_available": True,
        "model_3d_type": "none",
        "model_3d_url": "",
        "sku": "ONE8-ACC-SOX-3PK",
        "specifications": {
            "Quantity": "3 Pairs per pack",
            "Composition": "75% Combed Cotton, 22% CoolMax Poly, 3% Elastane",
            "Cushioning": "High-density looped terry footbed",
        },
        "sizes": ["Free Size (UK 7 - 11)"],
        "colors": [
            {"name": "Tri-Color (Black/White/Grey)", "hex": "#333333"},
        ],
    },
]


def add_featured_sports_products():
    print(f"Adding {len(NEW_FEATURED_SPORTS_PRODUCTS)} marquee sports products...")

    for data in NEW_FEATURED_SPORTS_PRODUCTS:
        slug = data["slug"]
        prod, created = Product.objects.update_or_create(
            slug=slug,
            defaults={
                "name": data["name"],
                "description": data["description"],
                "price": data["price"],
                "sale_price": data.get("sale_price"),
                "category": data["category"],
                "product_type": data["product_type"],
                "sub_category": data.get("sub_category", ""),
                "image": data["image"],
                "is_featured": data.get("is_featured", False),
                "is_available": data.get("is_available", True),
                "model_3d_type": data.get("model_3d_type", "none"),
                "model_3d_url": data.get("model_3d_url", ""),
                "sku": data.get("sku", ""),
                "specifications": data.get("specifications", {}),
            },
        )

        status = "Created" if created else "Updated"
        print(f"[{status}] {prod.name} ({prod.category} -> {prod.model_3d_type})")

        # Gallery Images
        for idx, img_url in enumerate(data.get("gallery", [])):
            ProductImage.objects.get_or_create(
                product=prod,
                image_url=img_url,
                defaults={"alt_text": f"{prod.name} View {idx+1}", "sort_order": idx},
            )

        # Variants
        for size in data.get("sizes", []):
            for color in data.get("colors", []):
                ProductVariant.objects.get_or_create(
                    product=prod,
                    size=size,
                    color=color["name"],
                    defaults={
                        "title": f"{prod.name} - {size} / {color['name']}",
                        "color_hex": color["hex"],
                        "price": prod.price,
                        "is_available": True,
                        "sku": f"{prod.sku}-{size.replace(' ', '')}-{color['name'][:3].upper()}",
                    },
                )


if __name__ == "__main__":
    update_existing_models_and_subcategories()
    add_featured_sports_products()
    total = Product.objects.count()
    with_3d = Product.objects.exclude(model_3d_type="none").exclude(model_3d_type="").count()
    print(f"\nCompleted! Total products in database: {total}")
    print(f"Products with verified 3D models: {with_3d}")
