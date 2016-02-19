import json
import os
from flask import Flask, render_template, send_from_directory, request
from flask_bootstrap import Bootstrap
from ScootLocations import ScootLocations

app = Flask(__name__)
environment = os.environ.get('ENVIRONMENT')
if not environment:
    environment = 'development'
if environment == 'development':
    app.debug = True
if environment == 'production':
    port = 9001
else:
    port = 5000

Bootstrap(app)

@app.route("/")
def index():
    return render_template('index.html')

@app.route('/api/scooters')
def current_scooters():
    scoot_location_files = [f for f in os.listdir('downloads') if os.path.isfile(os.path.join('downloads', f))]
    scoot_location_files = sorted(scoot_location_files)

    file_index = len(scoot_location_files) - 1
    scoot_locations = ScootLocations(scoot_location_files[file_index])
    scooter_list = scoot_locations.get_scooters()
    scooter_json = json.dumps(scooter_list)
    return scooter_json

@app.route('/api/scooters/<int:file_index>')
def scooters(file_index=0):
    scoot_location_files = [f for f in os.listdir('downloads') if os.path.isfile(os.path.join('downloads', f))]
    scoot_location_files = sorted(scoot_location_files)
    file_index = int(file_index)
    scoot_locations = ScootLocations(scoot_location_files[file_index])
    scooter_list = scoot_locations.get_scooters()
    scooter_json = json.dumps(scooter_list)
    return scooter_json



@app.route('/static/js/<path:path>')
def send_js(path):
    return send_from_directory('static/js', path)

@app.route('/static/css/<path:path>')
def send_css(path):
    return send_from_directory('static/css', path)

if __name__ == "__main__":
    app.run(port=port)
