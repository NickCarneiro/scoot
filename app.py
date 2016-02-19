import json
from flask import Flask, render_template, send_from_directory, jsonify
from flask_bootstrap import Bootstrap
from ScootLocations import ScootLocations

app = Flask(__name__)
app.debug = True
Bootstrap(app)

@app.route("/")
def index():
    return render_template('index.html')

@app.route('/api/scooters')
def scooters():
    scoot_locations = ScootLocations('downloads/2016-02-19_01:40:07.json')
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
    app.run()
