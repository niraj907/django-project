from django.contrib import admin
from .models import Category  


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'created_at')  # show these fields in the admin list
    search_fields = ('name', 'description')                     # add search functionality
    list_filter = ('created_at',)                               # filter by date
