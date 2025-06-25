import React, { useEffect, useState } from "react";
import { getUserData } from "../api/steamApi";
import UserCard from "../components/userCard";

const STEAM_ID = "76561198328388204"; // Cambia por el SteamID que quieras

export default function SteamProfile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserData(STEAM_ID)
      .then((data) => setUserData(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-white text-center mt-10">Cargando...</p>;
  }

  return (
    <div className="flex justify-center mt-10">
      {userData ? (
        <UserCard {...userData} />
      ) : (
        <p className="text-white">Usuario no encontrado</p>
      )}
    </div>
  );
}
