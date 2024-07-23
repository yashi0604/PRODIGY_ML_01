# PRODIGY_ML_01
TASK 1- Create a K-means clustering algorithm to group customers of a retail store based on their purchase history.

K-means clustering is a popular unsupervised machine learning algorithm used to partition a dataset into K distinct, non-overlapping clusters. It aims to group similar data points together while ensuring that the clusters are as distinct as possible.


Overview of K-means Clustering
Steps Involved:
Initialize Centroids:

Choose K initial centroids randomly from the dataset. These centroids are the initial "guesses" for the center of each cluster.
Assign Points to Clusters:

Assign each data point to the nearest centroid based on a distance metric (usually Euclidean distance). This forms K clusters.
Update Centroids:

Calculate the new centroids by taking the mean of all data points assigned to each cluster.
Repeat:

Repeat the assignment and update steps until the centroids no longer change significantly or a predefined number of iterations is reached.
Key Concepts:
Centroid: The center of a cluster, calculated as the mean of the data points in the cluster.
Distance Metric: Typically Euclidean distance, used to determine the nearest centroid.
Convergence: The point at which the centroids do not change significantly between iterations.
