from rest_framework import generics
from .models import Category
from category.serializer import CategorySerializer

# List all categories and create a new one
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by('-created_at')
    serializer_class = CategorySerializer
    

# Retrieve, update, or delete a single category
class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer