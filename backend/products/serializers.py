from rest_framework import serializers
from .models import Product, ProductImage, ProductVariant


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image_url", "alt_text", "sort_order"]


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "title",
            "size",
            "color",
            "color_hex",
            "price",
            "is_available",
            "sku",
        ]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    gallery = serializers.SerializerMethodField()
    available_sizes = serializers.SerializerMethodField()
    available_colors = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "sale_price",
            "category",
            "product_type",
            "sub_category",
            "image",
            "images",
            "gallery",
            "variants",
            "available_sizes",
            "available_colors",
            "is_featured",
            "is_available",
            "model_3d_type",
            "model_3d_url",
            "specifications",
            "sku",
            "created_at",
        ]

    def get_gallery(self, obj):
        urls = []
        if obj.image:
            urls.append(obj.image)
        for img in obj.images.all():
            if img.image_url and img.image_url not in urls:
                urls.append(img.image_url)
        return urls

    def get_available_sizes(self, obj):
        sizes = []
        for v in obj.variants.all():
            if v.size and v.size not in sizes:
                sizes.append(v.size)
        return sizes

    def get_available_colors(self, obj):
        colors = []
        seen = set()
        for v in obj.variants.all():
            if v.color and v.color not in seen:
                seen.add(v.color)
                colors.append({
                    "name": v.color,
                    "hex": v.color_hex or "#171717",
                })
        return colors