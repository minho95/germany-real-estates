const config = {
    mapboxApiAccessToken: "pk.eyJ1IjoibWluaG85NSIsImEiOiJja2EwMWkzOHAwY21nM2ZwbWQzYm1sems2In0.yEbNytr-dPEEkubtoWv5cA",
    defaultCity: 'munich',
    cities: ['berlin', 'hamburg', 'munich'],
    coordsBound: {
        'berlin': [13, 52.520008, 13.7, 52.520008],
        'hamburg': [9.7, 53.4, 10.2, 53.8],
        'munich': [11.4, 48.137154, 11.7, 48.137154]
    },
    pageSize: 8,
    apiUrl: 'https://real-estates-web.herokuapp.com'
}

export default config