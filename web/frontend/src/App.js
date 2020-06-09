import React from 'react';
import { connect } from 'react-redux';
import KeplerGl from 'kepler.gl';
import { addDataToMap, fitBounds } from 'kepler.gl/actions';
import { loadFlatsInCity, loadPercentiles, setUpdatedFlatsThunk } from './features/flats/flatsSlice'
import { formatPrice } from './helpers/formatPrice'
import { flatsToMapData } from './helpers/flatsToMapData'
import PercentilesTable from './PercentilesTable'
import config from './config'
import './App.css';


class App extends React.Component {
  state = {
    mapInitialized: false,
    width: 1920,
    height: 1080,
    currentCity: config.defaultCity,
  }


  componentDidMount() {
    const { flats, dispatch } = this.props

    if (!flats.all || !flats.all.length) {
      dispatch(loadFlatsInCity(this.state.currentCity))
    }

    dispatch(loadPercentiles())

    this.setState({
      height: window.innerHeight,
      width: window.innerWidth,
    })
  }

  componentDidUpdate(prevProps) {
    const { flats } = prevProps
    const { mapInitialized } = this.state

    const allFlats = this.props.flats.all

    const flatsInitialized = !mapInitialized && allFlats && allFlats.length
    const newFlats = allFlats.length !== flats.all.length

    if (flatsInitialized || newFlats) {
      this.updateMap()
    }
  }

  updateMap() {
    const { flats, dispatch } = this.props
    const allFlats = flats.all

    dispatch(
      addDataToMap({
        datasets: {
          info: {
            label: 'German flats',
            id: 'german flats'
          },
          data: flatsToMapData(allFlats.slice(0, 100))
        },
        options: {
          centerMap: true,
          readOnly: true
        },
        config: {},
      })
    );
    dispatch(fitBounds(config.coordsBound[this.state.currentCity]))
    this.setState({ mapInitialized: true })
  }

  changeCity(city) {
    this.setState({ currentCity: city })

    this.props.dispatch(loadFlatsInCity(city))
  }
 
  render() {
    const { all, percentiles } = this.props.flats
    const { width, height } = this.state

    if (!all || !all.length) return null

    return (
      <div className="App">
        <div className="App-header">
          <KeplerGl
            id="foo"
            width={width * 0.75}
            mapboxApiAccessToken={config.mapboxApiAccessToken}
            height={height}
          />
          <div className="flats-panel">
            <h2>Flats list</h2>
            <div className="flats-panel-city-select">
              {
                config.cities.map(city => (
                  <button
                    key={city}
                    onClick={() => this.changeCity(city)}
                    className={city === this.state.currentCity ? 'active' : ''}
                  >
                    {city}
                  </button>
                ))
              }
            </div>
            {all.map((flat, id) => (
              <div key={`${flat.address}-${id}`} className="flats-panel-item">
                <h3>{flat.address}</h3>
                <span className="flats-panel-item-price">
                  <strong>{formatPrice(flat.price)}</strong>
                </span>
                <div className="flats-panel-item-properties">
                  <span>{flat.size} &#13217;</span>
                  <span>{flat.rooms} {flat.rooms >= 2 ? 'rooms' : 'room' }</span>
                </div>
              </div>
            ))}
          </div>
          <button
            className="show-agg-button"
            onClick={() => window.scrollTo(0, this.percentilesRef.offsetTop)}
          >
            Show aggregated stats
          </button>
        </div>
        {
          percentiles &&
          <div
            id="percentiles"
            className="section percentiles"
            ref={ (ref) => this.percentilesRef=ref }
          >
            <h3>Percentiles of prices by city</h3>
            
            <PercentilesTable
              title="All flats"
              percentiles={percentiles.filter(q => q.rooms === 0)}
            />

            <PercentilesTable
              title="One bedroom flats"
              percentiles={percentiles.filter(q => q.rooms === 1)}
            />

            <PercentilesTable
              title="Two bedrooms flats"
              percentiles={percentiles.filter(q => q.rooms === 2)}
            />

            <PercentilesTable
              title="Three bedrooms flats"
              percentiles={percentiles.filter(q => q.rooms === 3)}
            />
          </div>
        }
      </div>
    )
  }
}


const mapStateToProps = state => ({ flats: state.flats })

const dispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, dispatchToProps)(App)
