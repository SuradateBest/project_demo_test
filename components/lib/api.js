
import axios from "axios";

export default axios.create({
  baseURL:"https://react-project-7899e-default-rtdb.asia-southeast1.firebasedatabase.app/"
})

const FIREBASE_DOMAIN =
  "https://react-project-7899e-default-rtdb.asia-southeast1.firebasedatabase.app/";

export async function addUser(userData) {
  const response = await fetch(
    `${FIREBASE_DOMAIN}/users/${userData.name}.json`,
    {
      method: "PUT",
      body: JSON.stringify(userData),
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not create user.");
  }

  return null;
}

export async function getProfile(name) {
  const response = await fetch(
    `${FIREBASE_DOMAIN}/users/${name}.json`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch name");
  }

  const loadedQuote = {
   
    id:name,
    ...data,
  };

  return loadedQuote;
}

