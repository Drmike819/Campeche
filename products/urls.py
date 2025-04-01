from django.urls import path
from .views import CategoriesView, FormProductosView
# url de la aplicacion (users)
urlpatterns = [
    # URLS
    path('categories/', CategoriesView.as_view(), name='categories'),
    path('form/new-product/', FormProductosView.as_view(), name='formulario_producto'),
]