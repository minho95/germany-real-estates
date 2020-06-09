import { formatPrice } from './formatPrice'

export const flatsToMapData = (flats) => ({
    fields: [
        {name: 'price', format: '', type: 'float'},
        {name: 'address', format: '', type: 'string'},
        {name: 'size', format: '', type: 'float'},
        {name: 'rooms', format: '', type: 'float'},
        {name: 'city', format: '', type: 'string'},
        {name: 'longitude', format: '', type: 'real'},
        {name: 'latitude', format: '', type: 'real'}
    ],
    rows: flats.map(flat => [formatPrice(flat.price), flat.address, flat.size, flat.rooms,
                            flat.city, flat.longitude, flat.latitude])
})