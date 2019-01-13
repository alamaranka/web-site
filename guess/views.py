from django.shortcuts import render
from django.views.generic import TemplateView

# Create your views here.
class GuessView(TemplateView):
    template_name  = 'guess.html'
