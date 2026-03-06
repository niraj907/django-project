from django.urls import path
from .views import ExpenseListCreateView, ExpenseDetailView, ExpenseSummaryView, BudgetView, BudgetCategoryListCreateView, BudgetCategoryDetailView

urlpatterns = [
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list'),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),
    path('expenses/summary/', ExpenseSummaryView.as_view(), name='expense-summary'),
    path('budget/', BudgetView.as_view(), name='budget'),
    path('budget-categories/', BudgetCategoryListCreateView.as_view(), name='budget-category-list'),
    path('budget-categories/<int:pk>/', BudgetCategoryDetailView.as_view(), name='budget-category-detail'),
]
