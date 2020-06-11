from flask import Flask, jsonify, request

from flask_cors import cross_origin
from db.database import Database
from db.models.Flat import Flat

import os

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
db = Database(app.config)
flat = Flat(db)

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/flats')
@cross_origin()
def get_flats():
    city = request.args.get('city')
    results = flat.get_by_city(city)
    rows_list = []

    for row in results:
        rows_list.append({
            'city': row[0],
            'country': row[1],
            'price': row[2],
            'size': row[3],
            'rooms': row[4],
            'latitude': row[5],
            'longitude': row[6],
            'address': row[7]
        })

    return jsonify(rows_list)


@app.route('/percentiles')
@cross_origin()
def get_percentiles():
    results = flat.get_percentiles()
    rows_list = []

    for row in results:
        rows_list.append({
            'city': row[0],
            'rooms': row[1],
            'percentile_10': row[2],
            'percentile_25': row[3],
            'median_price': row[4],
            'percentile_75': row[5],
            'percentile_90': row[6]
        })

    return jsonify(rows_list)

if __name__ == '__main__':
    app.run()