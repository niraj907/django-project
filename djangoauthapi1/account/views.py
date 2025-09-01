from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from account.serializers import UserChangePasswordSerializer, SendPasswordResetEmailSerializer, UserPasswordResetSerializer, UserProfileSerializer , UserRegistrationserializer , UserLoginserializer
from account.models import User
from django.contrib.auth import authenticate
from account.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken , TokenError
from rest_framework.permissions import IsAuthenticated

# from rest_framework_simplejwt.exceptions import AuthenticationFailed
# def get_tokens_for_user(user):
#     if not user.is_active:
#       raise AuthenticationFailed("User is not active")

#     refresh = RefreshToken.for_user(user)

#     return {
#         'refresh': str(refresh),
#         'access': str(refresh.access_token),
#     }

#generate token manually
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }   

class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request , format = None):
        serializer = UserRegistrationserializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response({"token": token, "message": "Registration Successful"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class VerifyOTPView(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         otp = request.data.get('otp')

#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

#         if user.otp == otp:
#             return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)
#         else:
#             return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('code')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        print("Expected OTP:", user.otp) 
        
        if user.otp == otp:
            user.is_verified = True         # ✅ Mark user as verified
            user.otp = None                 # ✅ Optionally clear the OTP
            user.save()
            return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = UserLoginserializer(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data.get('email')     
            password = serializer.validated_data.get('password')

            user = authenticate(email=email, password=password)  

            if user is not None:
                if not user.is_verified:
                    return Response(
                        {"error": "Please verify your email first."},
                        status=status.HTTP_403_FORBIDDEN
                    )
                token = get_tokens_for_user(user)
                user_data = UserProfileSerializer(user).data 
                return Response({
                    "token": token,
                    "user": user_data,
                    "message": "Login Successful"
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': {'non_field_errors': ['Email or Password is not valid']}},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# class UserProfileView(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     def get(self, request):
#         user = request.user
#         serializer = UserProfileSreializer(user)
#         return Response(serializer.data, status=status.HTTP_200_OK)




class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({ "user": serializer.data,  "message": "Profile updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AllUserProfileView(APIView):
    renderer_classes = [UserRenderer]
    def get(self, request):
        users = User.objects.all()
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            user = request.user
            new_password = serializer.validated_data['new_password']
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    

class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
              print("Reset Link from view:", serializer.validated_data.get("reset_link"))
              return Response(
                {"message": "Password reset link sent. Please check your Email"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    




class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(
            data=request.data,
            context={'uid': uid, 'token': token, 'request': request}
        )
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()   # ✅ Blacklist the refresh token
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user   # ✅ Get the logged-in user
        user.delete()         # ✅ Delete user from DB
        return Response(
            {"message": "Your account has been deleted successfully."},
            status=status.HTTP_200_OK
        )