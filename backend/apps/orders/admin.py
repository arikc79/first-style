from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display  = ['id', 'first_name', 'phone', 'total', 'status', 'delivery_type', 'created_at']
    list_filter   = ['status', 'delivery_type', 'payment_type']
    search_fields = ['first_name', 'phone', 'email']
    list_editable = ['status']
    inlines       = [OrderItemInline]
