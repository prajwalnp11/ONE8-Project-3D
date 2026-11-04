import os
import sys
import json
import re
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.db import transaction
from products.models import Product, ProductImage, ProductVariant

COLOR_HEX_MAP = {
    "white": "#f5f5f2",
    "black": "#171717",
    "grey": "#757575",
    "gray": "#757575",
    "blue": "#2563eb",
    "navy": "#1e293b",
    "green": "#16a34a",
    "olive": "#556b2f",
    "red": "#dc2626",
    "orange": "#ea580c",
    "yellow": "#ca8a04",
    "gold": "#b99a43",
    "sand": "#c9b49a",
    "beige": "#d4c5b2",
    "cream": "#f3efe6",
    "vanilla ice": "#ece8e1",
    "sonic blue": "#36c6ce",
    "trophy gold": "#b99a43",
    "jersey white": "#f8f8f6",
    "charcoal": "#333333",
    "pumice": "#d5d2c9",
    "teal": "#0d9488",
    "cyan": "#06b6d4",
}

def guess_color_hex(color_name):
    if not color_name:
        return "#171717"
    name_lower = color_name.lower().strip()
    if name_lower in COLOR_HEX_MAP:
        return COLOR_HEX_MAP[name_lower]
    for key, val in COLOR_HEX_MAP.items():
        if key in name_lower:
            return val
    return "#171717"

def clean_html(raw_html):
    if not raw_html:
        return ""
    clean = re.sub(r"<[^>]+>", " ", raw_html)
    clean = " ".join(clean.split())
    return clean

def extract_specifications(product_data, clean_desc):
    specs = {}
    ptype = product_data.get("product_type", "")
    if ptype:
        specs["Product Type"] = ptype

    tags = product_data.get("tags", [])
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",") if t.strip()]

    gender_tags = [t for t in tags if t in ["Men", "Women", "Unisex"]]
    if gender_tags:
        specs["Gender"] = gender_tags[0]

    category_tags = [t for t in tags if t in ["Lifestyle", "Performance", "Cricket", "Training", "Running"]]
    if category_tags:
        specs["Category"] = ", ".join(category_tags)

    if "co-created" in clean_desc.lower() or "virat" in clean_desc.lower():
        specs["Design Collaboration"] = "Co-created with Virat Kohli"

    if "moisture" in clean_desc.lower() or "sweat" in clean_desc.lower():
        specs["Fabric Feature"] = "Moisture-wicking active dry fabric"

    if "cushion" in clean_desc.lower() or "eva" in clean_desc.lower():
        specs["Cushioning"] = "Responsive high-rebound cushioning"

    if "stud" in clean_desc.lower() or "spike" in clean_desc.lower() or "cricket" in ptype.lower():
        specs["Traction"] = "Precision turf grip studs"

    specs["Authenticity"] = "Official ONE8 Performance Product"
    return specs

def import_all():
    step_files = [
        "/Users/prajwalnp/.gemini/antigravity/brain/5dc06016-7d89-47f3-91b7-864a9b12f979/.system_generated/steps/125/content.md",
        "/Users/prajwalnp/.gemini/antigravity/brain/5dc06016-7d89-47f3-91b7-864a9b12f979/.system_generated/steps/129/content.md",
    ]

    raw_products = []
    for sf in step_files:
        if not os.path.exists(sf):
            continue
        with open(sf, "r", encoding="utf-8") as f:
            content = f.read()
        json_start = content.find("{")
        if json_start != -1:
            data = json.loads(content[json_start:])
            raw_products.extend(data.get("products", []))

    print(f"Loaded {len(raw_products)} raw items from official store feed.")

    # Deduplicate by title
    unique_products = {}
    for p in raw_products:
        title = p["title"].strip()
        if title not in unique_products:
            unique_products[title] = p

    print(f"Unique official products: {len(unique_products)}")

    with transaction.atomic():
        # Step 1: Update existing 4 products to enrich them without deleting
        existing_products = {p.id: p for p in Product.objects.all()}
        print(f"Preserving existing {len(existing_products)} database records: {[p.name for p in existing_products.values()]}")

        # Update Cover Drive 18 X (pk=4 or by name)
        cover_drive = None
        for p in existing_products.values():
            if "cover drive 18 x" in p.name.lower():
                cover_drive = p
                break
        if cover_drive:
            cover_drive.category = "footwear"
            cover_drive.product_type = "Cricket Shoes"
            cover_drive.model_3d_type = "cricket_shoe"
            cover_drive.is_featured = True
            cover_drive.is_available = True
            # Preserve original image: /images/cover-drive-18x.jpeg
            if not cover_drive.image or cover_drive.image == "":
                cover_drive.image = "/images/cover-drive-18x.jpeg"
            cover_drive.price = 13999.00
            cover_drive.description = "Co-created with Virat Kohli, the Cover Drive 18 X is engineered for elite cricket performance with sonic blue accents, reinforced toe guard, and precision field traction studs."
            cover_drive.specifications = {
                "Sport": "Cricket",
                "Category": "Cricket Footwear",
                "Design Collaboration": "Co-created with Virat Kohli",
                "Colourway": "Jersey White - Sonic Blue - Trophy Gold",
                "Outsole": "Studded Cricket Turf Outsole",
                "Upper": "Engineered Synthetic Leather with Breathable Mesh",
            }
            cover_drive.save()

            # Add official variants for Cover Drive 18 X if not already present
            if cover_drive.variants.count() == 0:
                for uk_size in ["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"]:
                    ProductVariant.objects.create(
                        product=cover_drive,
                        title=f"Jersey White - Sonic Blue / {uk_size}",
                        size=uk_size,
                        color="Jersey White - Sonic Blue",
                        color_hex="#36c6ce",
                        price=13999.00,
                        is_available=True,
                        sku=f"CD18X-{uk_size.replace(' ', '')}",
                    )

            # Add official gallery images for Cover Drive 18 X
            official_cd_data = unique_products.get("Cover Drive 18 X")
            if official_cd_data and cover_drive.images.count() == 0:
                for idx, img in enumerate(official_cd_data.get("images", [])):
                    ProductImage.objects.create(
                        product=cover_drive,
                        image_url=img["src"],
                        alt_text=f"Cover Drive 18 X Angle {idx + 1}",
                        sort_order=idx + 1,
                    )

        # Update Boom Rush (pk=1)
        boom_rush = None
        for p in existing_products.values():
            if "boom rush" in p.name.lower():
                boom_rush = p
                break
        if boom_rush:
            boom_rush.category = "footwear"
            boom_rush.product_type = "Sneakers"
            boom_rush.model_3d_type = "running_shoe"
            boom_rush.is_featured = True
            boom_rush.specifications = {
                "Sport": "Running & Training",
                "Cushioning": "Responsive High-Rebound EVA Midsole",
                "Upper": "Engineered Breathable Mesh",
                "Outsole": "Durable High-Traction Rubber",
            }
            boom_rush.save()
            if boom_rush.variants.count() == 0:
                for sz in ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]:
                    ProductVariant.objects.create(
                        product=boom_rush,
                        size=sz,
                        color="Black / White",
                        color_hex="#171717",
                        price=boom_rush.price,
                        is_available=True,
                    )

        # Update Arc T-Shirt (pk=2)
        arc_tee = None
        for p in existing_products.values():
            if "arc t-shirt" in p.name.lower():
                arc_tee = p
                break
        if arc_tee:
            arc_tee.category = "apparel"
            arc_tee.product_type = "T-Shirt"
            arc_tee.model_3d_type = "apparel"
            arc_tee.is_featured = True
            arc_tee.specifications = {
                "Category": "Performance Apparel",
                "Fit": "Athletic Regular Fit",
                "Fabric": "Moisture-wicking stretch poly-cotton",
            }
            arc_tee.save()
            if arc_tee.variants.count() == 0:
                for sz in ["S", "M", "L", "XL", "XXL"]:
                    ProductVariant.objects.create(
                        product=arc_tee,
                        size=sz,
                        color="Black",
                        color_hex="#171717",
                        price=arc_tee.price,
                        is_available=True,
                    )

        # Update Prime Flo Cap (pk=3)
        prime_cap = None
        for p in existing_products.values():
            if "prime flo cap" in p.name.lower():
                prime_cap = p
                break
        if prime_cap:
            prime_cap.category = "accessories"
            prime_cap.product_type = "Caps"
            prime_cap.model_3d_type = "cap"
            prime_cap.specifications = {
                "Category": "Sportswear Accessories",
                "Crown": "6-Panel Structured Crown",
                "Closure": "Adjustable Metal Buckle Strap",
            }
            prime_cap.save()
            if prime_cap.variants.count() == 0:
                ProductVariant.objects.create(
                    product=prime_cap,
                    size="One Size",
                    color="Black",
                    color_hex="#171717",
                    price=prime_cap.price,
                    is_available=True,
                )

        # Step 2: Import all other official products
        existing_names_lower = {p.name.lower().strip() for p in Product.objects.all()}
        created_count = 0

        for title, pdata in unique_products.items():
            clean_title = title.strip()
            if clean_title.lower() in existing_names_lower:
                continue

            ptype = pdata.get("product_type", "")
            title_lower = clean_title.lower()

            # Determine category
            category = "accessories"
            if ptype in ["Cricket Shoes", "Sneakers"] or "shoe" in title_lower or "footwear" in title_lower:
                category = "footwear"
            elif ptype in [
                "T-Shirt", "Polo", "Jacket", "Sweatshirt", "Shorts", "Short",
                "Pants", "Leggings", "Tank Top"
            ]:
                category = "apparel"

            # Determine 3D model capability
            model_3d_type = "none"
            if "cricket" in title_lower or ptype == "Cricket Shoes" or "cover drive" in title_lower:
                model_3d_type = "cricket_shoe"
            elif ptype == "Sneakers" or "trainer" in title_lower or "shoe" in title_lower:
                model_3d_type = "running_shoe"
            elif ptype in ["T-Shirt", "Polo", "Jacket", "Sweatshirt", "Tank Top"]:
                model_3d_type = "apparel"
            elif ptype == "Caps":
                model_3d_type = "cap"

            # Clean description
            raw_desc = pdata.get("body_html", "")
            clean_desc = clean_html(raw_desc)
            if not clean_desc:
                clean_desc = f"Official ONE8 {clean_title}. Engineered for sport, movement and everyday performance."

            # Variants & Price
            variants = pdata.get("variants", [])
            price = 1999.00
            is_available = True
            if variants:
                try:
                    price = float(variants[0].get("price", 1999.00))
                except (ValueError, TypeError):
                    price = 1999.00
                is_available = any(v.get("available", False) for v in variants)

            # Images
            images = pdata.get("images", [])
            main_image = ""
            if images:
                main_image = images[0]["src"].replace(
                    "https://cdn.shopify.com/s/files/1/0692/3514/6912/files/",
                    "https://one8.com/cdn/shop/files/"
                )

            # Featured status for key flagship items
            is_featured = False
            flagship_keywords = [
                "cover drive", "boom rush", "cricket club polo", "windbreaker",
                "movement joggers", "arc t-shirt", "velocity", "nitro",
                "two tone t-shirt", "ribbed collar sweatshirt", "prime flo"
            ]
            if any(k in title_lower for k in flagship_keywords):
                is_featured = True

            specs = extract_specifications(pdata, clean_desc)

            product = Product.objects.create(
                name=clean_title,
                slug=pdata.get("handle", ""),
                description=clean_desc,
                price=price,
                category=category,
                product_type=ptype or "Sportswear",
                image=main_image,
                is_featured=is_featured,
                is_available=is_available,
                model_3d_type=model_3d_type,
                specifications=specs,
                sku=variants[0].get("sku", "") if variants else "",
            )
            existing_names_lower.add(clean_title.lower())
            created_count += 1

            # Create additional gallery images
            for idx, img in enumerate(images[1:8]):  # Up to 8 gallery photos
                g_url = img["src"].replace(
                    "https://cdn.shopify.com/s/files/1/0692/3514/6912/files/",
                    "https://one8.com/cdn/shop/files/"
                )
                ProductImage.objects.create(
                    product=product,
                    image_url=g_url,
                    alt_text=f"{clean_title} Angle {idx + 2}",
                    sort_order=idx + 1,
                )

            # Create variants
            for v in variants:
                vtitle = v.get("title", "")
                vprice = price
                try:
                    vprice = float(v.get("price", price))
                except (ValueError, TypeError):
                    pass

                # Parse option values
                vcolor = v.get("option1", "")
                vsize = v.get("option2", "")
                if not vsize and vtitle != "Default Title":
                    vsize = vtitle

                color_hex = guess_color_hex(vcolor or clean_title)

                ProductVariant.objects.create(
                    product=product,
                    title=vtitle,
                    size=vsize,
                    color=vcolor,
                    color_hex=color_hex,
                    price=vprice,
                    is_available=v.get("available", True),
                    sku=v.get("sku", "") or "",
                )

        print(f"Successfully imported {created_count} official ONE8 products!")
        print(f"Total products in database: {Product.objects.count()}")

if __name__ == "__main__":
    import_all()
