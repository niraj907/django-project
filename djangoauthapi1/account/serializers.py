# from rest_framework import serializers
# from account.models import User
# import random
# from django.core.mail import send_mail

# class UserRegistrationserializer(serializers.ModelSerializer):
#     password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

#     class Meta:
#         model = User
#         fields = ('email', 'name', 'password', 'password2')  # fixed here
#         extra_kwargs = {
#             'password': {'write_only': True},
#         }

#     # validate password and confirm password
#     def validate(self, attrs):
#         password = attrs.get('password')
#         password2 = attrs.get('password2')
#         if password != password2:
#             raise serializers.ValidationError("Password and Confirm Password should be same")
#         return attrs

#     def create(self, validated_data):
#         validated_data.pop('password2')  # remove password2 before saving
#         return User.objects.create_user(**validated_data)


from django.forms import ValidationError
from rest_framework import serializers
from account.models import User
import random
from django.core.mail import send_mail
from django.utils.encoding import smart_str , DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode , urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes

from .renderers import UserRenderer


class UserRegistrationserializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('email', 'name', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    # ✅ Check if passwords match
    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password should be same")
        return attrs

    # ✅ Create user and send OTP to email
    def create(self, validated_data):
        validated_data.pop('password2')  # remove password2 before saving

        # Generate 6-digit OTP
        otp_code = str(random.randint(100000, 999999))

        # Create user with OTP
        user = User.objects.create_user(**validated_data, otp=otp_code)

        # Send email with OTP
        send_mail(
            subject='Your OTP Verification Code',
            message=f'Hello {user.name},\n\nYour OTP code is: {otp_code}\n\nThank you!',
            from_email='chaudhariiiniraj@gmail.com',  # your Gmail
            recipient_list=[user.email],
            fail_silently=False,
        )

        return user


class UserLoginserializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(write_only=True)

# class UserProfileSreializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id','email', 'name')

class UserProfileSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, allow_null=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'username' , 'phone_number', 'permanent_address',  'image']
        read_only_fields = ['email', 'id']  



class UserChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context['request'].user  # ✅ Get the currently authenticated user

        old_password = attrs.get('old_password')
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')

        # ✅ Check if old password is correct
        if not user.check_password(old_password):
            raise serializers.ValidationError({"old_password": "Old password is incorrect."})

        # ✅ Check if new password and confirm password match
        if new_password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "New password and confirm password do not match."})
        
        return attrs

    
# class SendPasswordResetEmailSerializer(serializers.Serializer):
#     email = serializers.EmailField(max_length=255)

#     def validate(self, attrs):
#         email = attrs.get("email")
#         qs = User.objects.filter(email=email)
#         if not qs.exists():
#             # Use DRF's ValidationError so is_valid(raise_exception=True) handles it
#             raise ValidationError({"email": "You are not a Registered User"})

#         user = qs.first()
#         uid = urlsafe_base64_encode(force_bytes(user.pk))
#         token = PasswordResetTokenGenerator().make_token(user)
#         link = f"http://localhost:5173/api/user/reset/{uid}/{token}"

#         # send email
        

#         # These will now show in the same terminal where you ran `runserver`
#         print("Encoded UID:", uid)
#         print("Encoded Token:", token)
#         print("Password Reset link:", link)

#         # If you want the view to access them, stash in validated_data:
#         attrs["uid"] = uid
#         attrs["token"] = token
#         attrs["reset_link"] = link
#         return attrs

from django.conf import settings

from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives


class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    def validate(self, attrs):
        email = attrs.get("email")
        qs = User.objects.filter(email=email)
        if not qs.exists():
            raise ValidationError({"email": "You are not a Registered User"})

        user = qs.first()
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)
        link = f"http://localhost:5173/reset-password/{uid}/{token}"

        subject = "Reset Your Password"
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]

        # Plain text version
        text_content = f"""
        Hi {user.email},
        
        Click the link below to reset your password:
        {link}
        
        If you did not request this, please ignore this email.
        """

        # HTML version using template
        html_content = render_to_string("emails/password_reset_email.html", {
            "user_email": user.email,
            "reset_link": link
        })

        msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        attrs["uid"] = uid
        attrs["token"] = token
        attrs["reset_link"] = link
        return attrs


class UserPasswordResetSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')
        uid = self.context.get('uid')
        token = self.context.get('token')

        if new_password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "New password and confirm password do not match."})

        try:
            user_id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=user_id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError({"token": "Invalid or expired token"})

            self.context['user'] = user  # store user for use in save()
        except DjangoUnicodeDecodeError:
            raise serializers.ValidationError({"token": "Invalid token"})
        except User.DoesNotExist:
            raise serializers.ValidationError({"user": "User not found"})

        return attrs

    def save(self):
        user = self.context['user']
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return user