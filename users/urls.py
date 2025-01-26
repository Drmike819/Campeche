from django.urls import path
from .views import RegisterView
# url de la aplicacion (users)
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
]