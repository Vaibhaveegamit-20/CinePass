import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const { axios, getToken, user } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data?.bookings) {
        setBookings(data.bookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      getAllBookings();
    }
  }, [user]);

  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings" />

      <div className="max-w-5xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>

          <tbody className="text-sm font-light">
            {bookings.length > 0 ? (
              bookings.map((item, index) => {
                const userName = item?.user?.name || "Unknown User";
                const movieTitle = item?.show?.movie?.title || "N/A";
                const showTime = item?.show?.showDateTime
                  ? dateFormat(item.show.showDateTime)
                  : "N/A";

                // Normalize seats whether object or array
                const seatArray = Array.isArray(item?.bookedSeats)
                  ? item.bookedSeats
                  : Object.keys(item?.bookedSeats || {});
                const seatDisplay =
                  seatArray.length > 0 ? seatArray.join(", ") : "N/A";

                const amount = item?.amount || 0;

                // Skip rendering if show or movie data missing
                if (!item?.show?.movie) return null;

                return (
                  <tr
                    key={index}
                    className="border-b border-primary/20 bg-primary/5 even:bg-primary/10"
                  >
                    <td className="p-2 min-w-45 pl-5">{userName}</td>
                    <td className="p-2">{movieTitle}</td>
                    <td className="p-2">{showTime}</td>
                    <td className="p-2">{seatDisplay}</td>
                    <td className="p-2">
                      {currency}
                      {amount}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 py-6">
                  No bookings available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListBookings;
