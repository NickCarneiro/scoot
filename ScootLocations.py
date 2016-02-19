import json
import os


class ScootLocations:
    def __init__(self, json_file=None):
        self.scooters = []
        self.report_timestamp = None
        if json_file:
            self.parse(json_file)

    def parse(self, json_file):
        json_file_path = os.path.join(os.path.dirname(__file__), 'downloads', json_file)
        f = open(json_file_path)
        scoot_locations_json = f.read()
        f.close()
        scoot_locations = json.loads(scoot_locations_json)
        self.scooters = scoot_locations['scooters']
        self.report_timestamp = scoot_locations['asof']

    def get_scooters(self):
        response = {'scooters': self.scooters, 'timestamp': self.report_timestamp}
        return response


