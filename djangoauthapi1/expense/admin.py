from django.contrib import admin
from .models import Expense, Budget, BudgetCategory

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'type', 'category', 'date')
    list_filter = ('type', 'category', 'date')
    search_fields = ('description', 'user__email')

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'savings_goal')
    search_fields = ('user__email',)

@admin.register(BudgetCategory)
class BudgetCategoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'amount', 'period', 'alert_threshold')
    list_filter = ('period',)
    search_fields = ('user__email', 'category__name')