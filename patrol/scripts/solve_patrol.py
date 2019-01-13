from __future__ import print_function
from ortools.sat.python import cp_model
import numpy as np


# noinspection PyMethodMayBeStatic
class PatrolFinder:

    def __init__(self, number_of_grid, max_move, grid_values):
        self.number_of_grid = number_of_grid
        self.max_move = max_move
        self.grid_values = grid_values

    def patrol(self):gi
        route = []
        # data
        self.grid_values = np.tile(self.grid_values.transpose(), (1, self.max_move))

        grids = range(self.number_of_grid*self.number_of_grid)
        steps = range(self.max_move)

        entry_end_grids = []
        for i in range(self.number_of_grid):
            entry_end_grids.append(i*self.number_of_grid+self.number_of_grid-1)

        # model
        model = cp_model.CpModel()

        # variables
        x = [[model.NewBoolVar('x[%i,%i]' % (i, j)) for j in steps] for i in grids]

        # constraint1
        model.Add(sum(x[i][0] for i in entry_end_grids) == 1)

        # constraint2
        model.Add(sum(x[i][self.max_move-1] for i in entry_end_grids) == 1)

        # constraint3
        for j in steps:
            model.Add(sum(x[i][j] for i in grids) == 1)

        # constraint4
        for i in grids:
            model.Add(sum(x[i][j] for j in steps) <= 1)

        # constraint5
        for i in grids:
            for j in steps[:-1]:
                model.Add(x[i][j] - sum(x[k][j+1] for k in self.get_neighbors(i, self.number_of_grid)) <= 0)

        # Total benefit
        model.Maximize(sum(x[i][j] * self.grid_values[i][j] for j in steps for i in grids))

        solver = cp_model.CpSolver()
        status = solver.Solve(model)

        if status == cp_model.OPTIMAL:
            # print('Total value = %i' % solver.ObjectiveValue())
            for j in steps:
                for i in grids:
                    if solver.BooleanValue(x[i][j]):
                        route.append(str(i)+',')
        else:
            print("No solution!")

        return route

    def get_neighbors(self, grid, number_of_grid):
        neighbors = []
        if grid % number_of_grid != 0:
            neighbors.append(grid-1)
        if grid % number_of_grid != number_of_grid-1:
            neighbors.append(grid+1)
        if grid >= number_of_grid:
            neighbors.append(grid-number_of_grid)
        if grid < number_of_grid*number_of_grid-number_of_grid:
            neighbors.append(grid+number_of_grid)
        return neighbors
