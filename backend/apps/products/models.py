from django.db import models
from django.core.exceptions import ValidationError


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
    emoji       = models.CharField(max_length=10, default='👔',
                                   help_text='Використовується як fallback якщо немає фото')
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


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Товар',
    )
    image = models.ImageField(
        upload_to='products/',
        verbose_name='Фото',
    )
    order = models.PositiveSmallIntegerField(
        default=0,
        verbose_name='Порядок',
        help_text='0 = головне фото',
    )

    class Meta:
        ordering = ['order']
        verbose_name = 'Фото товару'
        verbose_name_plural = 'Фото товарів'

    def clean(self):
        # Максимум 4 фото на товар (не рахуємо поточний об'єкт при оновленні)
        qs = ProductImage.objects.filter(product=self.product)
        if self.pk:
            qs = qs.exclude(pk=self.pk)
        if qs.count() >= 4:
            raise ValidationError('Максимум 4 фото на товар.')

    def __str__(self):
        return f'{self.product.name} — фото {self.order + 1}'

