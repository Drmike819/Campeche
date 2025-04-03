from rest_framework.response import Response
from rest_framework import status
from .serializer import SerializerCategories, SerializerProducts, ProductSerializer
from rest_framework.views import APIView
from .models import Category, Products
from rest_framework.permissions import AllowAny, IsAuthenticated

# Create your views here.

# creacion de la (API) para obtener todas las categorias
class CategoriesView(APIView):
    # indicamos los permisos que necesita la API
    permission_classes = [AllowAny]
    # solicitud con el metodo get
    def get(self, request, *args, **kwargs):
        # nos devuel las instancias del todas las categorias
        categories = Category.objects.all()
        # convertimos las categorias en un formato JSON y inidcamo sque tendremos mas de una categoria
        serializer = SerializerCategories(categories, many=True)
        # retornamos la informacion del serializer (JSON)
        # print(serializer.data)
        return Response(serializer.data)
        

# creacion de la (API) para obtener todos los productos     
class ProducstView(APIView):
    # indicamos los permisos que necesita API
    permission_classes = [AllowAny]
    
    # Si el metodo de solicitud es get
    def get(self, request, *args, **kwargs):
        # obtenemos todos los objetos del modelo y lo almacenamos en una variable
        products = Products.objects.all()
        # llamamos al serializador indicando la variable en donde tenemos todos los objetos del modelo
        # many=True: indicamos que hay mas de un modelo
        serializer = SerializerProducts(products, many=True)
        # retornamos el serializador con toda la informacion
        return Response(serializer.data) 


# creacion de la (API) para obtener la informacion de un profducto en concreto
class DetailProductView(APIView):
    # indicamos los permisos que solicita la API
    permission_classes = [AllowAny]
    
    # Funcion que nos permite obtener el id de un producto
    def get_object(self, product_id):
        # capturacion de errores
        try:
            # si el id existe retornamos el oibjeto con el id
            return Products.objects.get(id = product_id)
        except Products.DoesNotExist:
            # si no existe retornamos none
            return None
    
    # si el metodo es get
    def get(self, request, product_id, *args, **kwargs):
        # almacenamos la funcion para obtener un producto en una variable
        product = self.get_object(product_id)
        # verificamos el valor obtenido por la funcion
        if not product:
            # en caso de que no exista retornamos un mensaje
            return Response({'rest': 'Producto no disponible'})
        # en casoi de que exista llamamos a serializer y le indicamos el objeto en concreto que serializara
        serializer = SerializerProducts(product)
        # retornamos la informacion del serializer y un mensdaje HTTP
        return Response(serializer.data, status=status.HTTP_200_OK)






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