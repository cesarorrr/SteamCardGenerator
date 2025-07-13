import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { getUserData } from "../api/steamApi";
import UserCard from "../components/userCard";
import jsPDF from "jspdf";
interface SteamProfileProps {
  steamId: string;
}

export default function SteamProfile({ steamId }: SteamProfileProps) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    getUserData(steamId)
      .then((data) => setUserData(data))
      .finally(() => setLoading(false));
  }, [steamId]);

  const handleDownload = async () => {
    if (cardRef.current) {
      const images = cardRef.current.getElementsByTagName("img");
      const promises = Array.from(images).map((img) => {
        if (!img.complete) {
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }
      });

      await Promise.all(promises);

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true, // 👈 Importante
      });
      const link = document.createElement("a");
      link.download = "profile.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const handleDownloadPDF = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      // 👇 Aquí especificas ancho y alto
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("steam-profile.pdf");
    }
  };

  if (loading) {
    return <p className="text-white text-center mt-10">Cargando...</p>;
  }

  return (
    <div className="flex flex-col items-center mt-10">
      {userData ? (
        <>
          <div ref={cardRef}>
            <UserCard {...userData} />
          </div>
          <button
            onClick={handleDownload}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Descargar Imagen
          </button>
          <button
            onClick={handleDownloadPDF}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            Descargar PDF
          </button>
        </>
      ) : (
        <p className="text-white">Usuario no encontrado</p>
      )}
    </div>
  );
}
