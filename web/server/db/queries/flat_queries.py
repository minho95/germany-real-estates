PERCENTILES_QUERY = """
select
    city,
    rooms_category as rooms,
    percentile_disc(0.1) within group (order by price) as percentile_10,
    percentile_disc(0.25) within group (order by price) as percentile_25,
    percentile_disc(0.5) within group (order by price) as median_price,
    percentile_disc(0.75) within group (order by price) as percentile_75,
    percentile_disc(0.9) within group (order by price) as percentile_90
    from (
        select
            price,
            city,
            CASE
                WHEN rooms < 2 THEN 1
                WHEN rooms >= 2 and rooms < 3 THEN 2
                WHEN rooms >= 3 and rooms < 4 THEN 3
                ELSE 4
            END as rooms_category
        from flats
    ) as t group by city, t.rooms_category 
union
    select
        city,
        0 as rooms,
        percentile_disc(0.1) within group (order by price) as percentile_10,
        percentile_disc(0.25) within group (order by price) as percentile_25,
        percentile_disc(0.5) within group (order by price) as median_price,
        percentile_disc(0.75) within group (order by price) as percentile_75,
        percentile_disc(0.9) within group (order by price) as percentile_90
    from flats group by city
"""

def city_query(city):
    return f"select * from flats where city = '{city}'"