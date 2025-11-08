import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import BlurCircle from './BlurCircle'
import { PlayCircleIcon } from 'lucide-react'

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])

  if (!currentTrailer) {
    return (
      <p className="text-gray-400 text-center py-10">
        No trailers available
      </p>
    )
  }

  // Convert the watch URL → embed URL
  const embedUrl = currentTrailer.videoUrl.replace('watch?v=', 'embed/')

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
        Trailers
      </p>

      <div className="relative mt-6 flex justify-center">
        <BlurCircle top="-100px" right="-100px" />

        {/* ✅ Direct iframe embed for guaranteed controls */}
        <iframe
          width="960"
          height="540"
          src={`${embedUrl}?autoplay=0&controls=1&modestbranding=1&rel=0&fs=1`}
          title="Movie Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-lg w-full max-w-[960px] h-[540px]"
        ></iframe>
      </div>

      {/* Thumbnail Selector */}
      <div className="group grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer, index) => (
          <div
            key={index}
            onClick={() => setCurrentTrailer(trailer)}
            className={`relative cursor-pointer transition duration-300 hover:-translate-y-1 ${
              trailer.videoUrl === currentTrailer.videoUrl
                ? 'opacity-100'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={trailer.image}
              alt="Trailer thumbnail"
              className="rounded-lg w-full h-48 md:h-60 object-cover brightness-75"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-8 h-8 md:w-12 md:h-12 text-white transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrailersSection
