import QRCode from "react-qr-code";

// --- Definiciones de Tipos ---
type GameInfo = {
  appid: number;
  name: string;
  img_icon_url: string;
};

type TopGame = GameInfo & {
  playtime_forever: number;
};

type RecentlyPlayedGame = GameInfo & {
  playtime_2weeks: number;
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
  const totalHoursPlayed = Math.floor(
    gamesOwned.reduce((acc, game) => acc + game.playtime_forever, 0) / 60
  );
  const recentHoursPlayed = Math.floor(
    recentlyPlayed.reduce((acc, game) => acc + game.playtime_2weeks, 0) / 60
  );

  return (
    <div className="bg-gray-950 text-white rounded-2xl p-6 shadow-2xl w-full max-w-4xl mx-auto space-y-6 font-sans relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center space-x-4">
          <img
            src={avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full border-2 border-purple-500 shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-bold text-purple-400">{username}</h2>
            {realName && <p className="text-sm text-gray-300">{realName}</p>}
            {country && <p className="text-xs text-gray-400">🌍 {country}</p>}
          </div>
        </div>
        {profileUrl && (
          <div className="mt-4 md:mt-0">
            <div className="bg-white p-2 rounded-xl shadow-inner">
              <QRCode value={profileUrl} size={80} level="H" />
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
        <div className="bg-gray-800 rounded-xl py-4 shadow-inner">
          <p className="text-purple-300 font-semibold text-lg">🎮</p>
          <p>Juegos</p>
          <p className="font-bold text-white">{totalGames}</p>
        </div>
        <div className="bg-gray-800 rounded-xl py-4 shadow-inner">
          <p className="text-purple-300 font-semibold text-lg">🏆</p>
          <p>Logros</p>
          <p className="font-bold text-white">{totalAchievements}</p>
        </div>
        <div className="bg-gray-800 rounded-xl py-4 shadow-inner">
          <p className="text-purple-300 font-semibold text-lg">🕹</p>
          <p>Últimas 2 semanas</p>
          <p className="font-bold text-white">{recentHoursPlayed} h</p>
        </div>

        <div className="bg-gray-800 rounded-xl py-4 shadow-inner">
          <p className="text-purple-300 font-semibold text-lg">⏱</p>
          <p>Horas jugadas</p>
          <p className="font-bold text-white">{totalHoursPlayed} h</p>
        </div>
      </div>

      {/* Sección de Juegos */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top 3 Más Jugados */}
        {top3Games.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-3">
              🎯 Top 3 Más Jugados
            </h3>
            <div className="space-y-3">
              {top3Games.map((game) => (
                <div
                  key={game.appid}
                  className="flex items-center bg-gray-800 rounded-lg p-3 shadow-md hover:scale-[1.01] transition-transform"
                >
                  <img
                    src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                    alt={game.name}
                    className="w-12 h-12 rounded shadow"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium">{game.name}</p>
                    <p className="text-xs text-gray-400">
                      ⏱ {formatPlaytime(game.playtime_forever)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jugado Recientemente */}
        {recentlyPlayed.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-3">
              🕒 Jugado Recientemente
            </h3>
            <div className="space-y-3">
              {recentlyPlayed.slice(0, 3).map((game) => (
                <div
                  key={game.appid}
                  className="flex items-center bg-gray-800 rounded-lg p-3 shadow-md hover:scale-[1.01] transition-transform"
                >
                  <img
                    src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                    alt={game.name}
                    className="w-12 h-12 rounded shadow"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium">{game.name}</p>
                    <p className="text-xs text-gray-400">
                      ⏱ {formatPlaytime(game.playtime_2weeks)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
