import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { IPdata } from './IPdataType'

function App() {
  const [IPaddress, setIPaddress] = useState("192.212.174.101")
  const [IPdata, setIPdata] = useState<IPdata>({
    ip: '',
    location: {
      country: '',
      region: '',
      city: '',
      lat: 0,
      lng: 0,
      postalCode: '',
      timezone: '',
      geonameId: 0,
    },
    domains: [],
    as: {
      asn: 0,
      name: '',
      route: '',
      domain: '',
      type: '',
    },
    isp: ''
  })
  const API_KEY: string = import.meta.env.VITE_API_KEY
  const FetchData = async () => {
    try {
      const res = await axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${IPaddress}`)
      console.log(res)
      setIPdata(res.data)
    }
    catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    FetchData()
  }, [])

  const ChangeCoords = ({ coords }: { coords: [number, number]}) => {
    const map = useMap()
    map.setView(coords, map.getZoom())
    return null
  }

  return (
    <>
      <div className='flex min-h-[100vh] justify-center'>
        <div className='flex flex-col items-center w-full'>
          <div className='text-white text-2xl font-bold text-center p-2 mt-2'>IP Address Tracker</div>
          <form className='flex max-w-[95%] my-3' onSubmit={(e) => {
            e.preventDefault()
            FetchData()
          }}>
            <input className='rounded-l-xl py-3 px-5 w-[576px] focus:outline-none text-md placeholder:text-[#999]' type='search' id='search-bar' placeholder='Search for any IP address or domain' onChange={(e) => setIPaddress(e.target.value)} />
            <button className='rounded-r-xl py-3 px-5 bg-black text-white text-md hover:bg-[#333] font-bold' type='submit'>{">"}</button>
          </form>
          <div className='flex flex-col sm:flex-row w-[800px] bg-white justify-around m-2 rounded-xl max-w-[95%] py-5 px-2'>
            <div className='flex flex-col text-center mb-3 px-3 sm:w-1/4 sm:border-r-2 sm:mb-0 sm:text-left'>
              <div className='text-[10px] text-[#999] font-bold tracking-wider mb-1'>IP ADDRESS</div>
              <div className='text-xl font-bold text-[#333]'>{IPdata.ip}</div>
            </div>
            <div className='flex flex-col text-center mb-3 px-3 sm:w-1/4 sm:border-r-2 sm:mb-0 sm:text-left'>
              <div className='text-[10px] text-[#999] font-bold tracking-wider mb-1'>LOCATION</div>
              <div className='text-xl font-bold text-[#333]border-2'>{IPdata.location.city}, {IPdata.location.region} {IPdata.location.postalCode}</div>
            </div>
            <div className='flex flex-col text-center mb-3 px-3 sm:w-1/4 sm:border-r-2 sm:mb-0 sm:text-left'>
              <div className='text-[10px] text-[#999] font-bold tracking-wider mb-1'>TIMEZONE</div>
              <div className='text-xl font-bold text-[#333]'>UTC {IPdata.location.timezone}</div>
            </div>
            <div className='flex flex-col text-center px-3 sm:w-1/4 sm:text-left'>
              <div className='text-[10px] text-[#999] font-bold tracking-wider mb-1'>ISP</div>
              <div className='text-xl font-bold text-[#333]'>{IPdata.isp}</div>
            </div>
          </div>
        </div>
        <div className='leaflet-container self-end'>
          <MapContainer center={[IPdata.location.lat, IPdata.location.lng]} zoom={12} zoomControl={false}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[IPdata.location.lat, IPdata.location.lng]}/>
            <ChangeCoords
              coords={[
                IPdata.location.lat,
                IPdata.location.lng
              ]}
            />
          </MapContainer>
        </div>
      </div>
    </>
  )
}

export default App
