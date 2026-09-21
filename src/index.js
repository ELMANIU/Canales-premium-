const R2_URL = "https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/";

export default {
  async fetch(request) {

    const url = R2_URL + "index.m3u8";

    const res = await fetch(url);

    if (!res.ok) {
      return new Response("Playlist no encontrada", {status:404});
    }

    let playlist = await res.text();

    const lines = playlist.split("\n");

    const salida = lines.map(line => {

      // deja intactas las etiquetas HLS
      if (line.startsWith("#")) {
        return line;
      }

      // convierte segmentos relativos a URL completa
      if (line.trim().endsWith(".ts")) {
        return R2_URL + line.trim();
      }

      return line;

    }).join("\n");


    return new Response(salida, {
      headers:{
        "Content-Type":"application/vnd.apple.mpegurl",
        "Access-Control-Allow-Origin":"*",
        "Cache-Control":"no-cache, no-store"
      }
    });

  }
};
