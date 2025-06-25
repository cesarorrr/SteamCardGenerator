import React from "react";
import QRCode from "react-qr-code";

// --- Definiciones de Tipos ---
type GameInfo = {
  appid: number;
  name: string;
  img_icon_url: string;
};

type TopGame = GameInfo & {
  playtime_forever: number; // Tiempo de juego en minutos
};

type RecentlyPlayedGame = GameInfo & {
  playtime_2weeks: number; // Tiempo jugado en las últimas 2 semanas en minutos
};

type GamerBusinessCardProps = {
  avatar: string;
  username: string;
  profileUrl: string;
  realName?: string | null;
  country?: string | null;
  status?: string;
  gamesOwned?: TopGame[];
  achievements?: { [key: string]: any[] };
  recentlyPlayed?: RecentlyPlayedGame[];
};

// --- Componente GamerBusinessCard ---
export default function GamerBusinessCard({
  avatar,
  username,
  profileUrl,
  realName,
  country,
  status,
  gamesOwned = [],
  achievements,
  recentlyPlayed = [],
}: GamerBusinessCardProps) {
  const totalGames = gamesOwned.length;
  const totalAchievements = achievements
    ? Object.values(achievements).flat().length
    : 0;

  const top3Games = [...gamesOwned]
    .sort((a, b) => b.playtime_forever - a.playtime_forever)
    .slice(0, 3);

  const formatPlaytime = (minutes: number): string => {
    if (minutes === 0) return "0 min";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0 && remainingMinutes > 0) {
      return `${hours} h ${remainingMinutes} min`;
    } else if (hours > 0) {
      return `${hours} h`;
    } else {
      return `${remainingMinutes} min`;
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row bg-gray-900 text-white rounded-2xl p-6 shadow-2xl overflow-hidden
                    w-[350px] h-[220px] md:w-[700px] md:h-[280px] relative font-sans
                    transform transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Fondo sutil tipo cuadrícula o patrón gamer */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-800 to-gray-700 opacity-90 z-0"></div>
      <div
        className="absolute inset-0 bg-[length:15px_15px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #333 0, #333 1px, transparent 1px, transparent 50%), repeating-linear-gradient(-45deg, #333 0, #333 1px, transparent 1px, transparent 50%)",
        }}
      ></div>

      {/* Contenido de la Tarjeta */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full">
        {/* Anverso / Columna Izquierda: Perfil, Estadísticas y QR */}
        <div className="flex flex-col items-start justify-between p-4 md:w-1/2 w-full">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-full border-2 border-purple-500 shadow-md"
            />
            <div>
              <h2 className="text-2xl font-extrabold text-purple-400 leading-tight">
                {username}
              </h2>
              {realName && <p className="text-sm text-gray-300">{realName}</p>}
              {country && <p className="text-xs text-gray-400">🌍 {country}</p>}
            </div>
          </div>

          {/* Estadísticas y QR en la misma fila */}
          <div className="flex items-center justify-between w-full mb-4">
            <div className="text-sm space-y-1">
              {totalGames > 0 && (
                <p>
                  <span className="text-lg mr-1">🎮</span> Juegos:{" "}
                  <strong>{totalGames}</strong>
                </p>
              )}
              {totalAchievements > 0 && (
                <p>
                  <span className="text-lg mr-1">🏆</span> Logros:{" "}
                  <strong>{totalAchievements}</strong>
                </p>
              )}
            </div>

            {profileUrl && (
              <div className="flex flex-col items-center ml-4">
                {" "}
                {/* Añadido margen izquierdo */}
                <div className="p-1 bg-white rounded-lg shadow-inner">
                  <QRCode value={profileUrl} size={90} level="H" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Escanéame</p>{" "}
                {/* Texto más corto */}
              </div>
            )}
          </div>
        </div>

        {/* Reverso / Columna Derecha: Juegos Destacados */}
        <div className="flex flex-col p-4 md:w-1/2 w-full md:border-l border-gray-700 space-y-4">
          {top3Games.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">
                🎯 Top 3 Más Jugados
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {top3Games.map((game) => (
                  <div
                    key={game.appid}
                    className="flex items-center space-x-3 bg-gray-800 rounded-lg p-2 transition-transform hover:scale-[1.02]"
                  >
                    <img
                      src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                      alt={game.name}
                      className="w-10 h-10 rounded shadow"
                    />
                    <div>
                      <p className="font-medium text-sm">{game.name}</p>
                      <p className="text-xs text-gray-400">
                        ⏱ {formatPlaytime(game.playtime_forever)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentlyPlayed.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mt-4 mb-2">
                ⚡ Jugado Recientemente
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {recentlyPlayed.slice(0, 3).map((game) => (
                  <div
                    key={game.appid}
                    className="flex items-center space-x-3 bg-gray-800 rounded-lg p-2 transition-transform hover:scale-[1.02]"
                  >
                    <img
                      src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                      alt={game.name}
                      className="w-10 h-10 rounded shadow"
                    />
                    <div>
                      <p className="font-medium text-sm">{game.name}</p>
                      <p className="text-xs text-gray-400">
                        ⏱ {formatPlaytime(game.playtime_2weeks)} (últ. 2 sem.)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
