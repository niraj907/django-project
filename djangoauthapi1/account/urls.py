from django.urls import path, include
from account.views import AllUserProfileView, DeleteAccountView, LogoutView, SendPasswordResetEmailView, UserChangePasswordView, UserLoginView, UserPasswordResetView, UserProfileView, UserRegistrationView , VerifyOTPView

urlpatterns = [
    path('register/',UserRegistrationView.as_view(),name="register"),
    path('verify-otp/', VerifyOTPView.as_view(), name="verify-otp"),
    path('login/',UserLoginView.as_view(),name="login"),
    path('profile/',UserProfileView.as_view(),name="profile"),
    path('alluserprofile/',AllUserProfileView.as_view(),name="alluserprofile"),
    path('changePassword/',UserChangePasswordView.as_view(),name="changePassword"),
    path('send-rest-password-email/',SendPasswordResetEmailView.as_view(),name="send-rest-password-email"),
    path('reset-passwod/<uid>/<token>/',UserPasswordResetView.as_view(),name='reset-passwod'),
    path('logout/', LogoutView.as_view(), name='logout'),
     path('deleteAccount/', DeleteAccountView.as_view(), name="deleteAccount"),

 
]
