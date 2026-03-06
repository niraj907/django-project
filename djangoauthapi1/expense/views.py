from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Expense, Budget, BudgetCategory
from .serializers import ExpenseSerializer, BudgetSerializer, BudgetCategorySerializer
from django.db.models import Sum


class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return expenses belonging to the logged-in user
        queryset = Expense.objects.filter(user=self.request.user)
        
        # Optional: Add simple filtering
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
            
        return queryset

    def perform_create(self, serializer):
        # Automatically assign logged-in user to the created Expense
        serializer.save(user=self.request.user)


class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only allow access to the logged-in user's own expenses
        return Expense.objects.filter(user=self.request.user)

class ExpenseSummaryView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        total_expenses = Expense.objects.filter(user=user).aggregate(Sum('amount'))['amount__sum'] or 0
        return Response({
            'total_expenses': total_expenses
        })

class BudgetView(generics.RetrieveUpdateAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Create a budget if it doesn't exist for the user
        budget, created = Budget.objects.get_or_create(user=self.request.user, defaults={'amount': 0.00})
        return budget


class BudgetCategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = BudgetCategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BudgetCategory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BudgetCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BudgetCategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BudgetCategory.objects.filter(user=self.request.user)
