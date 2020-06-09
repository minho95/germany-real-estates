import React from 'react'
import { formatPrice } from './helpers/formatPrice'

function PercentilesTable(props) {
    const percentiles = props.percentiles.sort((a, b) => {
        if (a.city < b.city) {
            return -1
        } else if (a.city > b.city) {
            return 1
        }
        return 0
    })
    
    return (
        <div>
            <h4>{props.title}</h4>
            <table>
                <thead>
                    <tr>
                        <th>City</th>
                        <th>10th percentile</th>
                        <th>25th percentile</th>
                        <th>Median</th>
                        <th>75th percentile</th>
                        <th>90th percentile</th>
                    </tr>
                </thead>
                <tbody>
                {
                    percentiles.map(q => (
                    <tr key={q.city}>
                        <td>{q.city}</td>
                        <td>{formatPrice(q.percentile_10)}</td>
                        <td>{formatPrice(q.percentile_25)}</td>
                        <td>{formatPrice(q.median_price)}</td>
                        <td>{formatPrice(q.percentile_75)}</td>
                        <td>{formatPrice(q.percentile_90)}</td>
                    </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}

export default PercentilesTable