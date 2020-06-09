from app import db
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.inspection import inspect
from sqlalchemy import and_


class Serializer(object):

    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}

    @staticmethod
    def serialize_list(l):
        return [m.serialize() for m in l]


class Flat(db.Model, Serializer):
    __tablename__ = 'flats'

    city = db.Column(db.String())
    country = db.Column(db.String())
    price = db.Column(db.Float)
    size = db.Column(db.Float)
    rooms = db.Column(db.Float)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    address = db.Column(db.String(), primary_key=True)
    
    def __init__(self, city, country, price, size, rooms, latitude, longitude, address):
        self.city = city
        self.country = country
        self.price = price
        self.size = size
        self.rooms = rooms
        self.latitude = latitude
        self.longitude = longitude
        self.address = address

    @staticmethod
    def query_by_cords(min_lat, max_lat, min_long, max_long):
        return Flat.query.filter(and_(Flat.latitude >= min_lat,
                                        Flat.latitude <= max_lat,
                                        Flat.longitude >= min_long,
                                        Flat.longitude <= max_long))

    @staticmethod
    def query_by_city(city):
        return Flat.query.filter_by(city=city).order_by(Flat.price)

    def __repr__(self):
        return 'Flat: {}'.format(self.address)