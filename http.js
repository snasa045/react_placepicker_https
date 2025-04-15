export const fetchAvailablePlaces = async () => {
  const response = await fetch("http://localhost:3000/places");

  if (!response.ok) {
    throw new Error("Failed to fetch places!");
  }

  return (await response.json()).places;
};

export const updateUserPlaces = async (places) => {
  const response = await fetch("http://localhost:3000/user-places", {
    method: "PUT",
    body: JSON.stringify({ places }),
    headers: {
      "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch places!");
  }

  return (await response.json()).message;
};

export const fetchUserPlaces = async () => {
    const response = await fetch("http://localhost:3000/user-places");
  
    if (!response.ok) {
      throw new Error("Failed to fetch user places!");
    }
  
    return (await response.json()).places;
  };
