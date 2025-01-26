from rest_framework import serializers
from .models import CustomUser
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

# Serializador de registro
class RegisterUserSerializer(serializers.ModelSerializer):
    # Definir la confirmación de contraseña como un campo adicional
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = CustomUser  # Esto utiliza el modelo de usuario personalizado
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def validate(self, data):
        """
        Verificar que las contraseñas coincidan.
        """
        password = data.get('password')
        password2 = data.get('password2')

        if password != password2:
            raise ValidationError("Las contraseñas no coinciden.")
        
        # Validar la contraseña con las validaciones del sistema
        validate_password(password)
        
        return data
    
    def create(self, validated_data):
        """
        Crear el usuario con la contraseña hasheada.
        """
        # Eliminar la contraseña2 porque no es un campo real del modelo
        validated_data.pop('password2', None)
        
        # Crear el usuario
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
# Serializador para login (autenticación)
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()