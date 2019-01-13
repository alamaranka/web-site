from django.shortcuts import render
from django.views.generic import TemplateView

# Create your views here.
class NashView(TemplateView):
    template_name  = 'nash.html'
