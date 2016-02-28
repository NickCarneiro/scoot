import os
from ScootLocations import ScootLocations

scoot_location_files = [f for f in os.listdir('downloads') if os.path.isfile(os.path.join('downloads', f))]
scoot_location_files = sorted(scoot_location_files)
for location_file in scoot_location_files:
    location = ScootLocations(location_file)
    scooters = location.get_scooters()
    timestamp = scooters['timestamp']
