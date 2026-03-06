from rest_framework import serializers
from .models import Expense, Budget, BudgetCategory
from category.serializer import CategorySerializer
from category.models import Category

class ExpenseSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        allow_null=True,
        required=False
    )
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'amount', 'type', 'description', 'date', 'category', 'category_id', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_category_id(self, value):
        # Ensure the category belongs to the logged-in user
        user = self.context['request'].user
        if value and value.user != user:
            raise serializers.ValidationError("Invalid category.")
        return value

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['amount', 'savings_goal']


class BudgetCategorySerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
    )
    category = CategorySerializer(read_only=True)

    class Meta:
        model = BudgetCategory
        fields = ['id', 'category', 'category_id', 'amount', 'period', 'alert_threshold', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_category_id(self, value):
        user = self.context['request'].user
        if value and value.user != user:
            raise serializers.ValidationError("Invalid category.")
        return value
