from django.db import models


class Product(models.Model):
    CATEGORY_CHOICES = [
        ("footwear", "Footwear"),
        ("apparel", "Apparel"),
        ("accessories", "Accessories"),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, blank=True, default="")
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Discounted promotional price in INR",
    )
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="footwear",
    )
    product_type = models.CharField(max_length=100, blank=True, default="")
    sub_category = models.CharField(
        max_length=100,
        blank=True,
        default="",
        help_text="e.g. Performance Running, Cricket Spikes, Training Shorts, etc.",
    )
    image = models.URLField(max_length=500, blank=True)
    is_featured = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    model_3d_type = models.CharField(
        max_length=50,
        blank=True,
        default="none",
        help_text="running_shoe, cricket_shoe, apparel, cap, cricket_bat, cricket_ball, water_bottle, or none",
    )
    model_3d_url = models.CharField(
        max_length=255,
        blank=True,
        default="",
        help_text="Direct static path or URL to .glb asset",
    )
    specifications = models.JSONField(blank=True, default=dict)
    sku = models.CharField(max_length=100, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_featured", "-created_at"]

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="images",
        on_delete=models.CASCADE,
    )
    image_url = models.URLField(max_length=500)
    alt_text = models.CharField(max_length=255, blank=True, default="")
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.product.name} Image {self.id}"


class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="variants",
        on_delete=models.CASCADE,
    )
    title = models.CharField(max_length=150, blank=True, default="")
    size = models.CharField(max_length=50, blank=True, default="")
    color = models.CharField(max_length=100, blank=True, default="")
    color_hex = models.CharField(max_length=20, blank=True, default="")
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    is_available = models.BooleanField(default=True)
    sku = models.CharField(max_length=100, blank=True, default="")

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.product.name} - {self.size or self.title}"