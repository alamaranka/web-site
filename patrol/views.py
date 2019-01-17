from django.views.generic import TemplateView
from django.http import HttpResponse
from .scripts.solve_patrol import PatrolFinder
import numpy as np


class PatrolView(TemplateView):
    template_name = 'patrol.html'


def patrol_route(request):
    number_of_grid = int(request.GET['number_of_grid'])
    max_move = int(request.GET['max_move'])
    grid_values = str_to_np_array(request.GET['grid_values'])

    patrol_finder = PatrolFinder(number_of_grid, max_move, grid_values)
    solution = patrol_finder.patrol()
    return HttpResponse(solution)


def str_to_np_array(string):
    np_arr = np.array([])
    string = string.split(',')
    for s in string:
        if s != "":
            np_arr = np.append(np_arr, int(s))
    np_arr = np_arr.astype(int).reshape(1,-1)
    return np_arr
