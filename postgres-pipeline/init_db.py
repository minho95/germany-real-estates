from sqlalchemy import *
from config_local import uri #host, port, database, user, password, 

#conn_str = f"postgresql://{user}:{password}@{host}/{database}"
conn_str = uri

engine = create_engine(conn_str)
connection = engine.connect()
metadata = MetaData()

#city;country;price;size;rooms;latitude;longitude;address;

flats_table = Table('flats', metadata,
   Column('city', String(255), nullable=False),
   Column('country', String(3), nullable=False),
   Column('price', Float, nullable=False),
   Column('size', Float, nullable=False),
   Column('rooms', Float, nullable=False),
   Column('latitude', Float, nullable=True),
   Column('longitude', Float, nullable=True),
   Column('address', String(255), nullable=False)
)

mean_by_city = Table('mean_by_city', metadata,
   Column('city', String(255), nullable=False),
   Column('price', Integer, nullable=False)
)

try:
   flats_table.drop(engine)
   print("Flats table was dropped")
except:
   print("Dropping flats table failed")
   pass

try:
   mean_by_city.drop(engine)
   print("mean_by_city table was dropped")
except:
   print("Dropping mean_by_city table failed")
   pass


flats_table.create(engine)
mean_by_city.create(engine)

for city in ['munich', 'hamburg', 'berlin']:
   with open('../data/flats/{}.csv'.format(city)) as munich_flats:
      conn = create_engine(uri).raw_connection()
      cursor = conn.cursor()
      cmd = "COPY flats(city, country, price, size, rooms, latitude, longitude, address) FROM STDIN WITH (FORMAT CSV, HEADER TRUE, DELIMITER ';')"
      cursor.copy_expert(cmd, munich_flats)
      conn.commit()
      print(city, "flats loaded to postgres")


################################################################
####################### MEAN BY CITY ###########################
################################################################

query_mean_by_city = "SELECT city, AVG(price) FROM flats GROUP BY city"

res = connection.execute(query_mean_by_city)

print("Mean by city insert\n")
for row in res:
   ins = mean_by_city.insert().values(city=row[0], price=row[1])
   connection.execute(ins)