from django.db.models import Q
from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer


class ProductListAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = (
            Product.objects.all()
            .prefetch_related("images", "variants")
            .order_by("-is_featured", "-created_at")
        )

        category = self.request.query_params.get("category")
        if category and category.lower() != "all":
            category = category.lower().strip()
            if category in ["footwear", "apparel", "accessories"]:
                queryset = queryset.filter(category=category)
            elif category == "cricket":
                queryset = queryset.filter(
                    Q(product_type__icontains="cricket")
                    | Q(name__icontains="cricket")
                    | Q(name__icontains="cover drive")
                )
            elif category in ["sneakers", "running", "training"]:
                queryset = queryset.filter(
                    Q(category="footwear")
                    & ~Q(product_type__icontains="cricket")
                    & ~Q(name__icontains="cover drive")
                )
            elif category == "t-shirts":
                queryset = queryset.filter(product_type__iexact="T-Shirt")
            elif category == "polos":
                queryset = queryset.filter(product_type__iexact="Polo")
            elif category in ["outerwear", "jackets"]:
                queryset = queryset.filter(
                    Q(product_type__iexact="Jacket")
                    | Q(product_type__iexact="Sweatshirt")
                )
            elif category in ["bottoms", "pants", "shorts"]:
                queryset = queryset.filter(
                    Q(product_type__iexact="Pants")
                    | Q(product_type__iexact="Shorts")
                    | Q(product_type__iexact="Short")
                    | Q(product_type__iexact="Leggings")
                )
            elif category in ["caps", "headwear"]:
                queryset = queryset.filter(product_type__iexact="Caps")
            else:
                queryset = queryset.filter(
                    Q(category__iexact=category)
                    | Q(product_type__iexact=category)
                )

        product_type = self.request.query_params.get("type")
        if product_type:
            queryset = queryset.filter(product_type__iexact=product_type)

        search = self.request.query_params.get("search")
        if search:
            search = search.strip()
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(product_type__icontains=search)
            )

        featured = self.request.query_params.get("featured")
        if featured is not None:
            if featured.lower() in ["true", "1"]:
                queryset = queryset.filter(is_featured=True)
            elif featured.lower() in ["false", "0"]:
                queryset = queryset.filter(is_featured=False)

        ordering = self.request.query_params.get("ordering")
        if ordering == "price_asc":
            queryset = queryset.order_by("price")
        elif ordering == "price_desc":
            queryset = queryset.order_by("-price")
        elif ordering == "name":
            queryset = queryset.order_by("name")
        elif ordering == "featured":
            queryset = queryset.order_by("-is_featured", "-created_at")

        return queryset


class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.all().prefetch_related("images", "variants")
    serializer_class = ProductSerializer
    lookup_field = "pk"