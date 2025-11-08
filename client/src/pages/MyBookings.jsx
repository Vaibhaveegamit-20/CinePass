import React, { useEffect, useState } from 'react' 
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import isoTimeFormat from '../lib/isoTimeFormat'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

const MyBookings = () => {

  const currency = import.meta.env.VITE_CURRENCY

  const {axios, getToken, user, image_base_url} = useAppContext()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getMyBookings = async()=> {
    try{
      const {data} = await axios.get('/api/user/bookings',
        {headers: {Authorization: `Bearer ${await getToken()}` }})
        if(data.success) {
          setBookings(data.bookings)
        }
    }catch(error){
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    if(user){
      getMyBookings()
    }
  },[user])

  {/*return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px"/>
      <div>
        <BlurCircle bottom="0px" left="600px"/>
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>

      {bookings.map((item, index)=>(
        <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'>
          <div className='flex flex-col md:flex-row'>
            <img src={image_base_url + item.show.movie.poster_path} alt="" className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'/>
            <div className='flex flex-col p-4'>
              <p className='text-lg font-semibold'>{item.show.movie.title}</p>
              <p className='text-gray-400 text-sm'>{timeFormat(item.show.movie.runtime)}</p>
              <p className='text-gray-400 text-sm mt-auto'>{dateFormat(item.show.showDateTime)}</p>
            </div>
          </div>

          <div className='flex flex-col md:items-end md:text-right justify-between p-4' >
            <div className='flex items-center gap-4'>
              <p className='text-2xl font-semibold mb-3'>{currency}{item.amount}</p>
              {!item.isPaid && <Link to={item.paymentLink} className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-mediu cursor-pointer'>Pay Now </Link>} 
            </div>

            <div className='text-sm'>
              <p><span className='text-gray-400'>Total Tickets: </span>{item.bookedSeats.length}</p>
              <p><span className='text-gray-400'>Seat Number: </span>{item.bookedSeats.join(", ")}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : <Loading/> */}

  return !isLoading ? (
  <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
    <BlurCircle top="100px" left="100px" />
    <BlurCircle bottom="0px" left="600px" />

    <h1 className="text-lg font-semibold mb-4">My Bookings</h1>

    {/* ✅ Empty State */}
    {bookings.length === 0 ? (
      <div className="flex flex-col items-center justify-center text-center py-20 text-gray-400">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="Empty bookings"
          className="w-32 h-32 mb-6 opacity-80"
        />
        <h2 className="text-xl font-semibold text-white mb-2">No bookings yet</h2>
        <p className="max-w-md text-gray-400 mb-6">
          You haven’t booked any movies yet. Explore our latest releases and grab your seats now!
        </p>
        <Link
          to="/movies"
          className="bg-primary px-6 py-2 rounded-full text-white font-medium hover:opacity-90 transition"
        >
          Browse Movies
        </Link>
      </div>
    ) : (
      bookings
        .filter((item) => item?.show && item?.show?.movie) // ✅ only render complete bookings
        .map((item, index) => {
          const movie = item.show.movie;

          return (
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl"
            >
              {/* Movie Details */}
              <div className="flex flex-col md:flex-row">
                <img
                  src={image_base_url + movie.poster_path}
                  alt={movie.title || 'Movie poster'}
                  className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
                />
                <div className="flex flex-col p-4">
                  <p className="text-lg font-semibold">{movie.title}</p>
                  <p className="text-gray-400 text-sm">
                    {timeFormat(movie.runtime)}
                  </p>
                  <p className="text-gray-400 text-sm mt-auto">
                    {dateFormat(item.show.showDateTime)}
                  </p>
                </div>
              </div>

              {/* Payment + Seat Info */}
              <div className="flex flex-col md:items-end md:text-right justify-between p-4">
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-semibold mb-3">
                    {currency}
                    {item.amount}
                  </p>
                  {!item.isPaid && item.paymentLink && (
                    <Link
                      to={item.paymentLink}
                      className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer hover:opacity-90"
                    >
                      Pay Now
                    </Link>
                  )}
                </div>

                <div className="text-sm">
                  <p>
                    <span className="text-gray-400">Total Tickets: </span>
                    {item.bookedSeats?.length || 0}
                  </p>
                  <p>
                    <span className="text-gray-400">Seat Number: </span>
                    {item.bookedSeats?.join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          );
        })
    )}
  </div>
) : <Loading />
}

export default MyBookings
