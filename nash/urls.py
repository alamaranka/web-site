from django.urls import path
from . import views

app_name = 'nash'

urlpatterns = [
    path('', views.NashView.as_view(), name="nash"),
]
