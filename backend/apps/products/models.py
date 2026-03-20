from django.db import models

class Product(models.Model):
    CATEGORIES = [
        ('Джинси', 'Джинси'),
        ('Сорочки', 'Сорочки'),
        ('Костюми', 'Костюми'),
        ('Спорт', 'Спорт'),
        ('Куртки', 'Куртки'),
        ('Кросівки', 'Кросівки'),
    ]

    name        = models.CharField(max_length=255)
    category    = models.CharField(max_length=100, choices=CATEGORIES)
    price       = models.PositiveIntegerField()
    old_price   = models.PositiveIntegerField(null=True, blank=True)
    description = models.TextField()
    emoji       = models.CharField(max_length=10, default='👔')
    sizes       = models.JSONField(default=list)
    details     = models.JSONField(default=dict, blank=True,
                                   help_text='{"Склад":"...", "Країна":"...", "Колір":"..."}')
    badge       = models.CharField(max_length=50, blank=True)
    in_stock    = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Товар'
        verbose_name_plural = 'Товари'

    def __str__(self):
        return self.name
