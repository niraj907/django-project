from django.db import models
from django.conf import settings
from category.models import Category

class Expense(models.Model):
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense')
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='expenses'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='expenses'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=7, choices=TRANSACTION_TYPES, default='expense')
    description = models.CharField(max_length=255)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        sign = '+' if self.type == 'income' else '-'
        return f"{self.user.email} - {sign}{self.amount} on {self.date}"

    class Meta:
        ordering = ['-date', '-created_at']

class Budget(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='budget'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2) # Monthly Budget
    savings_goal = models.DecimalField(max_digits=12, decimal_places=2, default=0) # Savings Goal
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Store the month and year of the last alert (Format: YYYY-MM) 
    last_alert_month = models.CharField(max_length=7, blank=True, null=True)

    def __str__(self):
        return f"{self.user.email} - Budget: {self.amount}, Goal: {self.savings_goal}"


class BudgetCategory(models.Model):
    PERIOD_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='budget_categories'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='budget_categories'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES, default='monthly')
    alert_threshold = models.DecimalField(max_digits=5, decimal_places=2, default=80)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'category')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.category.name}: {self.amount} ({self.period})"

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.db.models import Sum
from datetime import datetime

@receiver(post_save, sender=Expense)
def check_budget_limit(sender, instance, created, **kwargs):
    user = instance.user
    
    try:
        budget = Budget.objects.get(user=user)
    except Budget.DoesNotExist:
        return
        
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    total_expenses = Expense.objects.filter(
        user=user,
        type='expense',
        date__month=current_month,
        date__year=current_year
    ).aggregate(Sum('amount'))['amount__sum'] or 0
    
    if total_expenses > budget.amount:
        current_month_str = f"{current_year}-{current_month:02d}"
        
        # Check if alert was already sent for the current month
        if budget.last_alert_month != current_month_str:
            subject = 'Budget Exceeded Alert'
            message = f'Hello {user.name},\n\nYou have exceeded your monthly budget of ${budget.amount}.\nYour total expenses for this month are now ${total_expenses}.\n\nPlease review your tracking!'
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [user.email]
            
            try:
                send_mail(subject, message, from_email, recipient_list, fail_silently=True)
                # Note: We use update to avoid re-triggering signals unintentionally if we had signals bounded to Budget.
                Budget.objects.filter(id=budget.id).update(last_alert_month=current_month_str)
            except Exception as e:
                print("Email sending failed:", e)
