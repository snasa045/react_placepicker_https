import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { fetchUserPlaces, updateUserPlaces } from "../http.js";
import ErrorPage from "./components/ErrorPage";
import { sortPlacesByDistance } from "./loc.js";

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();
  const [errorUserPlaces, setErrorUserPlaces] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsLoading(true);
      try {
        const places = await fetchUserPlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            [...places],
            position.coords.latitude,
            position.coords.altitude
          );

          setUserPlaces(() => [...sortedPlaces]);
        });
      } catch (error) {
        setErrorUserPlaces({
          message:
            error.message || "Could not fetch places, please try again later!",
        });
      }
      setIsLoading(false);
    };

    fetchPlaces();
  }, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      setUserPlaces([...userPlaces]);
      setErrorUpdatingPlaces({
        message: error.message || "Failed to update places!",
      });
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );

      try {
        await updateUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );
      } catch (error) {
        setUserPlaces([...userPlaces]);
        setErrorUpdatingPlaces({
          message: error.message || "Failed to update places!",
        });
      }

      setModalIsOpen(false);
    },
    [userPlaces]
  );

  const handleError = () => {
    setErrorUpdatingPlaces(null);
  };

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        <ErrorPage
          title='An error occurred!'
          message={errorUpdatingPlaces?.message}
          onConfirm={handleError}
        />
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt='Stylized globe' />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {errorUserPlaces && (
          <ErrorPage
            title='An error occurred!'
            message={errorUserPlaces.message}
          />
        )}
        <Places
          title="I'd like to visit ..."
          fallbackText='Select the places you would like to visit below.'
          isLoading={isLoading}
          loadingText='Loading places...'
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
