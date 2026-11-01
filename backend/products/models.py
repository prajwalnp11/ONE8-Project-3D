
from django.db import models


class Product(models.Model):
    CATEGORY_CHOICES = [
        ("footwear", "Footwear"),
        ("apparel", "Apparel"),
        ("accessories", "Accessories"),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES
    )
    image = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name