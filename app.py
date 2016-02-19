from flask import Flask, render_template, send_from_directory
from flask_bootstrap import Bootstrap

app = Flask(__name__)
app.debug = True
Bootstrap(app)

@app.route("/")
def hello():
    return render_template('index.html')

@app.route('/static/js/<path:path>')
def send_js(path):
    return send_from_directory('static/js', path)

if __name__ == "__main__":
    app.run()
