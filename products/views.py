from rest_framework.response import Response
from rest_framework import status
from .serializer import SerializerCategories, ProductSerializer
from rest_framework.views import APIView
from .models import Category, Products
from rest_framework.permissions import AllowAny, IsAuthenticated

# Create your views here.

# creacion de la (API)
class CategoriesView(APIView):
    # solicitud con el metodo get
    def get(self, request):
        # nos devuel las instancias del todas las categorias
        categories = Category.objects.all()
        # convertimos las categorias en un formato JSON y inidcamo sque tendremos mas de una categoria
        serializer = SerializerCategories(categories, many=True)
        # retornamos la informacion del serializer (JSON)
        # print(serializer.data)
        return Response(serializer.data)
        
# creamos la API para el formulario del producto     
class FormProductosView(APIView):
    # indicamos los permisos (por el momento no require permisos)
    permission_classes = [AllowAny]
    # llamamos al serializador de del foprmulario de los productos
    # serializer_class = SerializerFormProducto
    
    # inidcamos la funcion si el metodo solicitado por el cliente es GET
    def get(self, request, *args, **kwargs):
        # iniciamos una variable en donde almacenaremos la clave y el valor de las opciones previamente elegidas
        unit_choices = [{'value': key, 'label': value} for key, value in Products.UNIT_CHOICES]
        categorias = Category.objects.all()
        opciones_categorias = [{'value': categoria.id, 'label': categoria.name} for categoria in categorias]
        # variable en donde almacenamos los campos para el formulario, y posterior mente retornarla para la API
        fields = [
            {"name": "name", "label": "Nombre del producto", "type": "text", "required": True},
            {"name": "description", "label": "Descripcion del producto", "type": "text", "required": True},
            {"name": "price", "label": "Precio del producto", "type": "number", "step": "0.01", "required": True},
            {"name": "stock", "label": "Cantidad disponible", "type": "number", "step": "1", "required": True},
            {"name": "unit", "label": "Unidad de medida", "type": "select", "options": unit_choices, "required": True},
            # {"name": "unit", "label": "Categorias", "type": "multi-select", "options": opciones_categorias, "required": True},
            {"name": "images", "label": "Imágenes del producto", "type": "file", "multiple": True, "required": False},
        ]
        # retornamos la variable fields en donde estara almacenado los campos del formulario
        return Response({"fields": fields})
    
    def post(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'La autenticacion es requerida'}, status=status.HTTP_401_UNAUTHORIZED)
        
        data = request.data.copy()
        data['producer'] = user.id
        
        price = float(data.get('price', 0))
        stock = int(data.get('stock', 0))

        if price <= 0 or stock < 0:
            return Response({"detail": "El precio debe ser mayor a 0 y el stock no puede ser negativo"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            producto = serializer.save()

            # Guardamos imágenes si se proporcionan
            images = request.FILES.getlist('images')
            for image in images:
                producto.images.create(image=image)

            return Response({"detail": "Producto creado correctamente"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)