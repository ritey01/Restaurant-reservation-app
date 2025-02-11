import React, { useState, useEffect } from "react";
import "./ReservationList.css";
import { formatDate } from "../utils/formatDate";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const ReservationList = () => {
  const [reservations, setReservation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchReservations = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reservations`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 404) {
        setIsNotFound(true);
        return;
      }
      if (response.ok === false) {
        setErrorStatus(true);
        return;
      }

      const reservationData = await response.json();
      if (reservationData.length === 0) {
        setIsNotFound(true);
        return;
      }

      setReservation(reservationData);
      setIsLoading(false);
    };
    fetchReservations();
  }, [getAccessTokenSilently]);

  if (isNotFound) {
    return (
      <>
        <h1 className="notFoundTitle">Upcoming reservations</h1>
        <p>You don't have any reservations.</p>
        <Link to={`/`} className="restaurantLink">
          View the restaurants
        </Link>
      </>
    );
  }
  if (errorStatus) {
    return (
      <>
        <h1>Oh no something went wrong! Please try again</h1>
        <Link to={`/`} className="restaurantLink">
          View the restaurants
        </Link>
      </>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <h1 className="reservationListTitle">Upcoming reservations</h1>
      <ul className="reservationListCard">
        {reservations.map((reservation) => {
          return (
            <li key={reservation.id}>
              <div className="reservationListContent">
                <h2 className="reservationListName">
                  {reservation.restaurantName}
                </h2>

                <p className="reservationListDate">
                  {formatDate(reservation.date)}
                </p>

                <Link
                  to={`/reservations/${reservation.id}`}
                  className="detailsLink"
                >
                  View details &rarr;
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ReservationList;
