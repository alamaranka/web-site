from django.urls import path
from . import views

app_name = 'patrol'

urlpatterns = [
    path('', views.PatrolView.as_view(), name="patrol"),
    path('patrol_route/', views.patrol_route, name="patrol_route"),
]
