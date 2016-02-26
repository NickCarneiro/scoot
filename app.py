import json
import os
from flask import Flask, render_template, send_from_directory, request
from flask_bootstrap import Bootstrap
from ScootLocations import ScootLocations
from process_data import process_scoot_data

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
def scooters():
    scoot_data_path = 'scoot_data.json'
    if not os.path.isfile(scoot_data_path):
        scoot_data = process_scoot_data()
        scoot_data_json = json.dumps(scoot_data)
        f = open(scoot_data_path, 'w')
        f.write(scoot_data_json)
        f.close()
    f = open(scoot_data_path)
    scooter_json = f.read()
    f.close()
    return scooter_json



@app.route('/static/js/<path:path>')
def send_js(path):
    return send_from_directory('static/js', path)

@app.route('/static/css/<path:path>')
def send_css(path):
    return send_from_directory('static/css', path)

if __name__ == "__main__":
    app.run(port=port)
