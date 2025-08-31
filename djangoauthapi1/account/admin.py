from django.contrib import admin
from account.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class UserModelAdmin(BaseUserAdmin):
    # Fields to display in the list view
    list_display = ["id", "email", "name", "username", "phone_number", "permanent_address", "image", "is_admin"]
    list_filter = ["is_admin"]

    fieldsets = [
        ("User Credential", {"fields": ["email", "password"]}),
        ("Personal info", {
            "fields": ["name", "username", "phone_number", "permanent_address", "image"],
        }),
        ("Permissions", {"fields": ["is_admin"]}),
    ]

    # Fields used while adding a new user
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "name", "username", "phone_number", "permanent_address", "image", "password1", "password2"],
            },
        ),
    ]

    search_fields = ["email", "name", "username", "phone_number"]
    ordering = ["email", "id"]
    filter_horizontal = []


# Register the User with custom admin
admin.site.register(User, UserModelAdmin)
