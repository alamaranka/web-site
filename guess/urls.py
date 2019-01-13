from django.urls import path
from . import views

app_name = 'guess'

urlpatterns = [
    path('', views.GuessView.as_view(), name="guess"),
]
