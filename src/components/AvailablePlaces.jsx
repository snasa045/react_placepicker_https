import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const getAvailablePlaces = async () => {
      setIsLoading(true);

      try {
        const fetchedAvailablePlaces = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            [...fetchedAvailablePlaces],
            position.coords.latitude,
            position.coords.altitude
          );

          console.log("sortedPlaces", sortedPlaces);

          setAvailablePlaces(() => [...sortedPlaces]);
          setIsLoading(false);
        });
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch places, please try again later!",
        });
        setIsLoading(false);
      }
    };

    getAvailablePlaces();
  }, []);

  console.log("error", error);

  if (error) {
    return <ErrorPage title='An error occurred!' message={error.message} />;
  }

  return (
    <Places
      title='Available Places'
      places={availablePlaces}
      isLoading={isLoading}
      loadingText='Loading places...'
      fallbackText='No places available.'
      onSelectPlace={onSelectPlace}
    />
  );
}
