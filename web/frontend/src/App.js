import React from 'react';
import { connect } from 'react-redux';
import KeplerGl from 'kepler.gl';
import { addDataToMap, fitBounds } from 'kepler.gl/actions';
import { loadFlatsInCity, loadPercentiles } from './features/flats/flatsSlice'
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
    page: 1,
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
          info: { label: 'German flats', id: 'german flats' },
          data: flatsToMapData(allFlats)
        },
        options: {
          centerMap: true,
          readOnly: true
        }
      })
    )
    dispatch(fitBounds(config.coordsBound[this.state.currentCity]))
    this.setState({ mapInitialized: true })
  }

  changeCity(city) {
    this.setState({ currentCity: city, page: 1 })

    this.props.dispatch(loadFlatsInCity(city))
  }

  changePage(page) {
    this.setState({ page })
  }
 
  render() {
    const { all, percentiles } = this.props.flats
    const { width, height, page } = this.state

    if (!all || !all.length) return null

    const flatsCount = all.length
    const { pageSize } = config
    const lastPage = Math.floor(flatsCount / pageSize) - (flatsCount % pageSize === 0 ? 1 : 0)

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
            {
            all.slice((page - 1) * pageSize, page * pageSize).map((flat, id) => (
              <div key={`${flat.address}-${id}`} className="flats-panel-item">
                <div className="flats-panel-item-properties">
                <h3>{flat.address}</h3>
                <span className="flats-panel-item-price">
                  <strong>{formatPrice(flat.price)}</strong>
                </span>
                </div>
                <div className="flats-panel-item-properties">
                  <span>{flat.size} &#13217;</span>
                  <span>{flat.rooms} {flat.rooms >= 2 ? 'rooms' : 'room' }</span>
                </div>
              </div>
            ))
            }
            <div className="pagination">
              <div
                className={`pagination-item ${page === 1 ? 'active' : ''}`}
                onClick={() => this.changePage(1)}
              >
                1
              </div>
              {
                [page - 1, page, page + 1].filter(p => p > 1 && p < lastPage).map(p => (
                  <div
                    className={`pagination-item ${page === p ? 'active' : ''}`}
                    onClick={() => this.changePage(p)}
                  >
                    {p}
                  </div>  
                ))
              }
              <div
                className={`pagination-item ${page === lastPage ? 'active' : ''}`}
                onClick={() => this.changePage(lastPage)}
              >
                {lastPage}
              </div>
            </div>
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
