import re
from geopy.geocoders import Nominatim
geolocator = Nominatim(user_agent="user", timeout=10)


class OfferDOM():
    def __init__(self, dom_element, city_name):
        self.dom_element = dom_element
        self.city_name = city_name
        self.primary_criterions = self.dom_element.find_all(class_="result-list-entry__primary-criterion")
        self.address = self.dom_element.find(class_="result-list-entry__address").text.strip()
        self.cords = None

    def get_cords(self):
        defuault_cords = {
            'latitude': None,
            'longitude': None
        }

        try:
            loc = geolocator.geocode(self.get_address())

            if loc:
                return {
                    'latitude': loc.latitude,
                    'longitude': loc.longitude
                }

            return defuault_cords

        except Exception as err:
            print("Exception thrown")
            print(err)
            return defuault_cords

    def get_title(self):
        title = self.dom_element.find("h5").text.strip().replace('\n', '')
        title = f'"{title}"'
        return title
    
    def clean_price(self, price):
        return price.replace('€', '').replace('.', '').replace(' ', '').replace(',', '.')

    def get_price(self):
        price = self.primary_criterions[0].find('dd').text.strip()
        return self.clean_price(price)

    def get_address(self):
        return f'"{self.address}"'

    def clean_rooms(self, rooms):
        return rooms.replace('Zi.', '').replace(' ', '').replace(',', '.')
    
    def get_rooms(self):
        rooms_count = self.primary_criterions[2].find(class_="onlyLarge").text
        return self.clean_rooms(rooms_count)

    def clean_size(self, size):
        return size.replace(' m²', '').replace(',', '.')

    def get_size(self):
        size = self.primary_criterions[1].find('dd').text.strip()
        return self.clean_size(size)

    def get_obj(self):
        obj = []
        self.cords = self.get_cords()
        
        if '-' in self.get_price():
            offers_list = self.dom_element.find_all(class_="grouped-listing")

            for offer in offers_list:
                criterions = offer.find_all(class_="grouped-listing__criterion font-nowrap")
                price = self.clean_price(criterions[0].text.strip())
                size = self.clean_size(criterions[1].text.strip())
                rooms = self.clean_rooms(criterions[2].text.strip())
                
                obj.append({
                    'address': self.get_address(),
                    'rooms': rooms,
                    'size': size,
                    'price': price,
                    'latitude': self.cords['latitude'],
                    'longitude': self.cords['longitude']
                })

        else:
            obj.append({
                'price': self.get_price(),
                'address': self.get_address(),
                'rooms': self.get_rooms(),
                'size': self.get_size(),
                'latitude': self.cords['latitude'],
                'longitude': self.cords['longitude']
            })

        return obj