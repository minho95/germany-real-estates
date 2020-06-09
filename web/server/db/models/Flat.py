from .DbModel import DbModel
from ..queries.flat_queries import *


class Flat(DbModel):
    def __init__(self, *args, **kwargs):
        super(Flat, self).__init__(*args, **kwargs)

    def get_percentiles(self):
        self.cursor.execute(PERCENTILES_QUERY)
        return self.cursor.fetchall()
    
    def get_by_city(self, city):
        self.cursor.execute(city_query(city))
        return self.cursor.fetchall()