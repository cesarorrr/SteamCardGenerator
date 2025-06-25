import axios from "axios";

export async function getUserData(steamId: string) {
  const response = await axios.get(
    `http://localhost:8000/api/steam-user/${steamId}`
  );
  // Aquí ya te llegará el objeto completo que el backend te devuelve
  console.log(response.data);
  return response.data;
}
