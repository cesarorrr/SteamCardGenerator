import httpx
from app.config import STEAM_API_KEY

async def get_steam_user_data(steam_id: str) -> dict:
    async with httpx.AsyncClient() as client:
        # 1. Info básica del usuario
        url_profile = f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={STEAM_API_KEY}&steamids={steam_id}"
        resp_profile = await client.get(url_profile)
        if resp_profile.status_code != 200:
            raise Exception("Error al contactar Steam API - perfil")
        players = resp_profile.json().get("response", {}).get("players", [])
        if not players:
            raise ValueError("Usuario no encontrado")
        player = players[0]

        # 2. Juegos que tiene el usuario (incluyendo nombres y tiempos)
        url_games = f"https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key={STEAM_API_KEY}&steamid={steam_id}&include_appinfo=true&include_played_free_games=true"
        resp_games = await client.get(url_games)
        if resp_games.status_code != 200:
            raise Exception("Error al contactar Steam API - juegos")
        games_data = resp_games.json().get("response", {})
        games = games_data.get("games", [])

        # 3. Juegos más jugados recientemente
        url_recent = f"https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key={STEAM_API_KEY}&steamid={steam_id}"
        resp_recent = await client.get(url_recent)
        recent_games = []
        if resp_recent.status_code == 200:
            recent_games = resp_recent.json().get("response", {}).get("games", [])

        # 4. Logros de los 3 juegos más jugados (por ejemplo)
        achievements = {}
        top_games = games[:3]  # puedes ajustar la cantidad

        for game in top_games:
            appid = game["appid"]
            url_achievements = f"https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key={STEAM_API_KEY}&steamid={steam_id}&appid={appid}"
            resp_achievements = await client.get(url_achievements)
            if resp_achievements.status_code == 200:
                data = resp_achievements.json()
                # Guardamos los logros con la key del appid
                achievements[appid] = data.get("playerstats", {}).get("achievements", [])
            else:
                achievements[appid] = []

        # Armar la respuesta final
        user_data = {
            "avatar": player["avatarfull"],
            "username": player["personaname"],
            "profileUrl": player["profileurl"],
            "realName": player.get("realname"),
            "country": player.get("loccountrycode"),
            "status": "En línea" if player["personastate"] == 1 else "Desconectado",
            "gamesOwned": games,
            "recentlyPlayed": recent_games,
            "achievements": achievements,
        }

        return user_data
