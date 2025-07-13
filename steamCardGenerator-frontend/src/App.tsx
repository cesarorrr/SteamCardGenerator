import { useState } from "react";
import SteamProfile from "./pages/steamProfile";

function App() {
  const [steamId, setSteamId] = useState("");
  const [submittedSteamId, setSubmittedSteamId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSteamId(steamId);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Introduce Steam ID"
          value={steamId}
          onChange={(e) => setSteamId(e.target.value)}
          className="border px-4 py-2 rounded mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </form>

      {submittedSteamId && <SteamProfile steamId={submittedSteamId} />}
    </div>
  );
}

export default App;
