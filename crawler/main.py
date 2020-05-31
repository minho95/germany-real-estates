from bs4 import BeautifulSoup
from datetime import datetime
import random
import urllib.request
import time
import re
import csv
import os
from offerdom import OfferDOM
from config import cities, PAGES_LIMIT

def get_url(city_url, page=0):
    return f'{city_url}{page}'

count = 0
fieldnames = ['city', 'country', 'price', 'size', 'rooms', 'latitude', 'longitude', 'address']


for city_key in cities:
    city = cities[city_key]
    print('\n\nParsing city: ', city["name"])

    flats = []
    pages_list = None
    
    now = datetime.now()

    dir_path = f'../data/flats' #{now.strftime("%d-%m-%Y-%H")}'
    if not os.path.isdir(dir_path):
        os.mkdir(dir_path)

    with open(f'{dir_path}/{city_key}.csv', mode='w') as csv_file:
        print("Writting header to file")
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames, delimiter=';', quotechar="'")
        writer.writeheader()
        csv_file.flush()

    i = 1
    while i < PAGES_LIMIT:
        url = get_url(city["url"], i)
        print("Page", i, "url:", url)
        
        with urllib.request.urlopen(url) as response:
            html = response.read()
            soup = BeautifulSoup(html, 'html.parser')

            offers = soup.find_all(class_='result-list-entry')

            if not pages_list:
                try:
                    pages_list = soup.find('div', id="pageSelection").find('select').find_all('option')
                    pages_numbers = [int(val['value']) for val in pages_list]

                    PAGES_LIMIT = max(pages_numbers)
                    print("PAGES COUNT: ", PAGES_LIMIT)
                except:
                    pass

            for offer in offers:
                offer_obj = OfferDOM(offer, city["name"])

                try:
                    data = offer_obj.get_obj()

                    for item in data:
                        print("Price: ", item['price'], ", Rooms: ", item['rooms'])
                        item['city'] = city_key
                        item['country'] = city['country']

                        flats.append(item)

                except Exception as e:
                    print("--------Exception--------")
                    print(e)
                    pass

                time.sleep(1 + random.randint(1, 2))

        count += len(flats)
        with open(f'{dir_path}/{city_key}.csv', mode='a+') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames, delimiter=';', quotechar="'")
            for flat in flats:
                writer.writerow(flat)
            csv_file.flush()
            
            flats = []
            time.sleep(10 + random.randint(10, 20))

        i += 1

    print("Scraped: ", city_key)

print("Scraped ", count, "flats")