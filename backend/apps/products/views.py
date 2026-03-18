from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

class ProductListView(APIView):
    """GET /api/products/ — список товарів"""

    def get(self, request):
        category = request.query_params.get('category')
        products = Product.objects.filter(in_stock=True)
        if category:
            products = products.filter(category=category)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductDetailView(APIView):
    """GET /api/products/<id>/ — один товар"""

    def get(self, request, pk):
        try:
            product = Product.objects.get(pk=pk, in_stock=True)
        except Product.DoesNotExist:
            return Response({'error': 'Товар не знайдено'}, status=404)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
