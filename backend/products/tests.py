from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Product, ProductImage, ProductVariant


class ProductAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Cricket shoe
        self.p_cricket = Product.objects.create(
            name="COVER DRIVE 18 X",
            slug="cover-drive-18-x",
            description="Co-created with Virat Kohli for elite performance.",
            price=13999.00,
            category="footwear",
            product_type="Cricket Shoes",
            image="/images/cover-drive-18x.jpeg",
            is_featured=True,
            is_available=True,
            model_3d_type="cricket_shoe",
            specifications={"Sport": "Cricket", "Collaboration": "Virat Kohli"},
        )
        ProductImage.objects.create(
            product=self.p_cricket,
            image_url="https://one8.com/cdn/shop/files/cd18x_angle2.jpg",
            alt_text="Angle 2",
            sort_order=1,
        )
        ProductVariant.objects.create(
            product=self.p_cricket,
            title="Sonic Blue / UK 8",
            size="UK 8",
            color="Sonic Blue",
            color_hex="#36c6ce",
            price=13999.00,
            is_available=True,
        )

        # Running shoe
        self.p_runner = Product.objects.create(
            name="Boom Rush",
            slug="boom-rush",
            description="Performance running trainer.",
            price=9999.00,
            category="footwear",
            product_type="Sneakers",
            image="https://one8.com/cdn/shop/files/boom_rush.jpg",
            is_featured=False,
            is_available=True,
            model_3d_type="running_shoe",
        )

        # Apparel
        self.p_tee = Product.objects.create(
            name="Arc T-Shirt",
            slug="arc-t-shirt",
            description="Athletic training tee.",
            price=2499.00,
            category="apparel",
            product_type="T-Shirt",
            image="https://one8.com/cdn/shop/files/arc_tee.jpg",
            is_featured=False,
            is_available=True,
            model_3d_type="apparel",
        )

        # Cap
        self.p_cap = Product.objects.create(
            name="Prime Flo Cap",
            slug="prime-flo-cap",
            description="Structured sportswear cap.",
            price=1499.00,
            category="accessories",
            product_type="Caps",
            image="https://one8.com/cdn/shop/files/prime_cap.jpg",
            is_featured=False,
            is_available=True,
            model_3d_type="cap",
        )

    def test_list_products(self):
        url = reverse("product-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def test_filter_by_category(self):
        url = reverse("product-list")
        response = self.client.get(url, {"category": "footwear"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_by_cricket(self):
        url = reverse("product-list")
        response = self.client.get(url, {"category": "cricket"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "COVER DRIVE 18 X")
        self.assertEqual(response.data[0]["model_3d_type"], "cricket_shoe")

    def test_filter_by_running(self):
        url = reverse("product-list")
        response = self.client.get(url, {"category": "running"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Boom Rush")

    def test_search_products(self):
        url = reverse("product-list")
        response = self.client.get(url, {"search": "Cover Drive"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "COVER DRIVE 18 X")

    def test_order_by_price_asc(self):
        url = reverse("product-list")
        response = self.client.get(url, {"ordering": "price_asc"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        prices = [float(p["price"]) for p in response.data]
        self.assertEqual(prices, sorted(prices))

    def test_product_detail(self):
        url = reverse("product-detail", kwargs={"pk": self.p_cricket.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "COVER DRIVE 18 X")
        self.assertEqual(len(response.data["gallery"]), 2)
        self.assertEqual(response.data["available_sizes"], ["UK 8"])
        self.assertEqual(response.data["available_colors"][0]["name"], "Sonic Blue")
        self.assertEqual(response.data["specifications"]["Sport"], "Cricket")

    def test_price_range_filter(self):
        url = reverse("product-list")
        response = self.client.get(url, {"min_price": "2000", "max_price": "10000"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for prod in response.data:
            self.assertGreaterEqual(float(prod["price"]), 2000)
            self.assertLessEqual(float(prod["price"]), 10000)

    def test_has_3d_filter(self):
        url = reverse("product-list")
        response = self.client.get(url, {"has_3d": "true"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for prod in response.data:
            self.assertNotEqual(prod["model_3d_type"], "none")
            self.assertNotEqual(prod["model_3d_type"], "")
