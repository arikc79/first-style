from django.contrib import admin
from django.utils.html import format_html
from .models import Product, ProductImage

class ProductImageInline(admin.TabularInline):
    model         = ProductImage
    extra         = 1
    max_num       = 4
    fields        = ['image', 'order', 'preview']
    readonly_fields = ['preview']

    def preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:80px;width:80px;object-fit:cover;'
                'border-radius:6px;border:1px solid #333;" />',
                obj.image.url,
            )
        return '—'
    preview.short_description = 'Прев\'ю'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display    = ['id', 'main_photo', 'name', 'category', 'price', 'old_price', 'badge', 'in_stock', 'created_at']
    list_filter     = ['category', 'in_stock', 'badge']
    search_fields   = ['name', 'description']
    list_editable   = ['price', 'in_stock']
    readonly_fields = ['created_at']
    inlines         = [ProductImageInline]
    fieldsets = (
        ('Основне', {'fields': ('name', 'category', 'emoji', 'badge', 'in_stock')}),
        ('Ціна',    {'fields': ('price', 'old_price')}),
        ('Опис',    {'fields': ('description', 'sizes', 'details')}),
        ('Дати',    {'fields': ('created_at',)}),
    )

    def main_photo(self, obj):
        first = obj.images.first()
        if first:
            return format_html(
                '<img src="{}" style="height:48px;width:48px;object-fit:cover;border-radius:6px;" />',
                first.image.url,
            )
        return format_html('<span style="font-size:24px">{}</span>', obj.emoji)
    main_photo.short_description = 'Фото'
