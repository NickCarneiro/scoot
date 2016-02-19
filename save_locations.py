import time
import datetime
import requests

scoot_location_url = 'https://app.scootnetworks.com/api/v1/scooters.json?locations_updated_since=null'
now_unix_timestamp = int(time.time())
try:
    r = requests.get(scoot_location_url)
    output_file_name = datetime.datetime.fromtimestamp(now_unix_timestamp).strftime('%Y-%m-%d_%H:%M:%S')
    output_file_name += '.json'
    print output_file_name

    json_file = open('downloads/' + output_file_name, 'w')
    json_file.write(r.content)
    json_file.close()
except Exception as e:
    print e


