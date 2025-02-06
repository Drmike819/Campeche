from rest_framework.response import Response
from .serializer import SerializerCategories
from rest_framework.views import APIView
from .models import Category

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
        return Response(serializer.data)