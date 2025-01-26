from django.shortcuts import render

from rest_framework import status, generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializer import RegisterUserSerializer, LoginSerializer
# Create your views here.

# Vista para el registro de usuarios
class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterUserSerializer

    def get(self, request, *args, **kwargs):
        # Estructura del formulario, puedes personalizarla según tu modelo
        fields = [
            {"name": "username", "label": "Nombre de usuario", "type": "text", "required": True},
            {"name": "email", "label": "Email", "type": "email", "required": True},
            {"name": "password", "label": "Contraseña", "type": "password", "required": True},
            {"name": "password2", "label": "Confirmar Contraseña", "type": "password", "required": True},
        ]
        return Response({"fields": fields})

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)




# Vista para login de usuarios
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'username': user.username,
                    'email': user.email
                }
            })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

# Vista para el logout de usuarios
class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = Response({"detail": "Logged out successfully"})
        response.delete_cookie('access_token')  # Borra el token de la cookie si lo tenías en el frontend
        return response