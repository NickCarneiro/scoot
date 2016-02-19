from flask import Flask, render_template, send_from_directory
from flask_bootstrap import Bootstrap
from ScootLocations import ScootLocations

app = Flask(__name__)
app.debug = True
Bootstrap(app)

@app.route("/")
def hello():
    scoot_locations = ScootLocations('downloads/2016-02-19_01:40:07.json')
    scooters = scoot_locations.get_scooters()
    return render_template('index.html', scooters=scooters)

@app.route('/static/js/<path:path>')
def send_js(path):
    return send_from_directory('static/js', path)

if __name__ == "__main__":
    app.run()
