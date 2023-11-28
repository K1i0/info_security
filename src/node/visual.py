import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
import json

# turn JSON array from file into Python list [][]
data = [];
with open("data/graph.txt") as sfile:
    data = json.loads(sfile.read());

# Создаем матрицу смежности
adjacency_matrix = np.array(data)

# Создаем граф из матрицы смежности
graph = nx.from_numpy_array(adjacency_matrix)

# Рисуем граф
nx.draw(graph, with_labels=True)
plt.show()