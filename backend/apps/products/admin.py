from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display   = ['id', 'name', 'category', 'price', 'old_price', 'badge', 'in_stock', 'created_at']
    list_filter    = ['category', 'in_stock', 'badge']
    search_fields  = ['name', 'description']
    list_editable  = ['price', 'in_stock']
    readonly_fields = ['created_at']
    fieldsets = (
        ('Основне', {'fields': ('name', 'category', 'emoji', 'badge', 'in_stock')}),
        ('Ціна',    {'fields': ('price', 'old_price')}),
        ('Опис',    {'fields': ('description', 'sizes', 'details')}),
        ('Дати',    {'fields': ('created_at',)}),
    )
