const R2_BASE = "https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/";

export default {
  async fetch(request) {

    const playlistURL = R2_BASE + "index.m3u8";

    const response = await fetch(playlistURL);

    if (!response.ok) {
      return new Response("No se pudo cargar playlist", {
        status: 404
      });
    }

    let m3u8 = await response.text();

    let lines = m3u8.split("\n");

    let output = [];

    for (let line of lines) {

      // Mantener etiquetas HLS
      if (line.startsWith("#")) {
        output.push(line);
        continue;
      }

      line = line.trim();

      // Convertir segmentos .ts a URL absoluta
      if (line.endsWith(".ts")) {
        output.push(R2_BASE + line);
      }
      else if (line !== "") {
        output.push(line);
      }

    }

    let finalPlaylist = output.join("\n");


    return new Response(finalPlaylist, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });

  }
};
