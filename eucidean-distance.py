import math

def euclidean_distance(x1, y1, x2, y2):
    squared_distance = (x2 - x1) ** 2 + (y2 - y1) ** 2
    distance = math.sqrt(squared_distance)
    return distance

x1_values = []
y1_values = []

print("Enter x-coordinate and y-coordinate of Point 1 (separated by a space). Type 'endd' when done.")

while True:
    coordinates_input = input("Enter x1 y1 values: ")
    if coordinates_input.lower() == 'endd':
        break
    
    x1, y1 = map(float, coordinates_input.split())
    x1_values.append(x1)
    y1_values.append(y1)

x2_values = []
y2_values = []

print("Enter x-coordinate and y-coordinate of Point 2 (separated by a space). Type 'endd' when done.")

while True:
    coordinates_input = input("Enter x2 y2 values: ")
    if coordinates_input.lower() == 'endd':
        break
    
    x2, y2 = map(float, coordinates_input.split())
    x2_values.append(x2)
    y2_values.append(y2)

ans = []

for i in range(len(x1_values)):
    distances = []
    for j in range(len(x2_values)):
        distance = euclidean_distance(x1_values[i], y1_values[i], x2_values[j], y2_values[j])
        distances.append(distance)
    distances.sort()
    ans.append(distances[0])

print("Euclidean distances (minimum for each x1, y1 pair):")
for distance in ans:
    print(int(distance))
