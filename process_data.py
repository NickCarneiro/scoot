import json
import os

def process_scoot_data():
    scoot_location_files = [f for f in os.listdir('downloads') if os.path.isfile(os.path.join('downloads', f))]
    scoot_location_files = sorted(scoot_location_files)
    time_series_data = []

    for json_file in scoot_location_files:
        json_file_path = os.path.join(os.path.dirname(__file__), 'downloads', json_file)
        f = open(json_file_path)
        scoot_locations_json = f.read()
        f.close()
        scoot_locations = json.loads(scoot_locations_json)
        scooter_snapshots = scoot_locations['scooters']
        timestamp = scoot_locations['asof']
        time_series_datum = {'scooters': {}, 'timestamp': timestamp}
        total_charge = 0
        total_scooters_available = 0
        highest_scooter_id = 0
        for scooter in scooter_snapshots:
            total_scooters_available += 1
            total_charge += float(scooter['batt_pct_smoothed'])
            scooter_id = int(scooter['physical_scoot_id'])
            if scooter_id > highest_scooter_id:
                highest_scooter_id = scooter_id
            time_series_datum['scooters'][scooter_id] = \
                {'latitude': scooter['latitude'], 'longitude': scooter['longitude']}
        time_series_datum['average_charge_percentage'] = total_charge / len(scooter_snapshots)
        time_series_datum['highest_scooter_id'] = highest_scooter_id
        time_series_datum['total_scooters_available'] = total_scooters_available
        time_series_datum['scootilization_percentage'] = float(400 - total_scooters_available) / 400 * 100
        time_series_data.append(time_series_datum)
    return time_series_data

if __name__ == "__main__":
    scoot_data = process_scoot_data()
    scoot_json = json.dumps(scoot_data, sort_keys=False, indent=2)
    print scoot_json
