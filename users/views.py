from django.shortcuts import render

from rest_framework import status, generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializer import RegisterUserSerializer, LoginUserSerializer
# Create your views here.

# Vista para el registro de usuarios
class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    # otarga permisos a los usuarios si estan o no autentificados
    serializer_class = RegisterUserSerializer

    # si el metodo de peticion del cliente es (GET)
    def get(self, request, *args, **kwargs):
        # informacion que otorgara la api
        fields = [
            {"name": "username", "label": "Nombre de usuario", "type": "text", "required": True},
            {"name": "email", "label": "Email", "type": "email", "required": True},
            {"name": "password", "label": "Contraseña", "type": "password", "required": True},
            {"name": "password2", "label": "Confirmar Contraseña", "type": "password", "required": True},
        ]
        # retornara un diccionario
        return Response({"fields": fields})
    # si el metodo de peticion es (POST)
    def post(self, request, *args, **kwargs):
        # envia los datos del cliente
        return super().post(request, *args, **kwargs)


# vista para que el usuario inicie sesion
class LoginView(generics.GenericAPIView):
    # esto permite que cualquier usuario pueda accder a esta view
    permission_classes = [AllowAny]
    # inidcamos que serializer utilizaremos para esta vista
    serializer_class = LoginUserSerializer
    
    # si el metodo solicitado por el usuario es(GET)
    def get(self, request, *args, **kwargs):
        # Información que otorgará la API
        fields = [
            {"name": "username", "label": "Nombre de usuario", "type": "text", "required": True},
            {"name": "password", "label": "Contraseña", "type": "password", "required": True},
        ]
        # Retorna un diccionario con los campos
        return Response({"fields": fields})

    # si el metodo solicitado por el usuario es(POST)
    def post(self, request, *args, **kwargs):
        # Utilizamos el serializer para validar las credenciales
        serializer = self.get_serializer(data=request.data) # (data=request.data) es la informciuon enviada por el usuario
        # verifica que los datos del usuario sean validos
        serializer.is_valid(raise_exception=True)

        # Si las credenciales son válidas, generamos los tokens
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Retorna los tokens junto con la informacion del usuario usuario
        return Response({
            'access': access_token,
            'refresh': str(refresh),
            'userName': user.username,
            'userImage': user.profile_image.url if user.profile_image else None,
            'userAddress':user.address,
            'userPhone': user.phone_number,
            'userEmail': user.email,
            'isSeller': user.is_seller,
            'isBuyer': user.is_buyer,
        })