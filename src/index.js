const R2_BASE = "https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/";

export default {
  async fetch(request) {

    const url = new URL(request.url);
    let path = url.pathname;

    path = path.replace(/^\/+/, "");


    // ==========================
    // PLAYLIST M3U8
    // ==========================
    if (path === "" || path === "index.m3u8") {

      const response = await fetch(R2_BASE + "index.m3u8");

      if (!response.ok) {
        return new Response("Playlist no encontrada", {
          status: 404
        });
      }

      let playlist = await response.text();


      let lines = playlist.split("\n");

      let segmentLines = [];

      for (let line of lines) {
        if (line.trim().endsWith(".ts")) {
          segmentLines.push(line.trim());
        }
      }


      // cuantos segmentos dejamos atrás
      const delaySegments = 5;


      // si hay suficientes segmentos quitamos los últimos 5
      const allowed = segmentLines.slice(
        0,
        Math.max(0, segmentLines.length - delaySegments)
      );


      let output = [];
      let index = 0;


      for (let line of lines) {

        if (line.trim().endsWith(".ts")) {

          if (index < allowed.length) {
            output.push(line);
          }

          index++;

        } else {

          output.push(line);

        }

      }


      return new Response(output.join("\n"), {

        headers:{
          "Content-Type":"application/x-mpegURL; charset=utf-8",
          "Access-Control-Allow-Origin":"*",
          "Cache-Control":"no-cache, no-store, must-revalidate"
        }

      });

    }



    // ==========================
    // SEGMENTOS TS
    // ==========================

    if (path.endsWith(".ts")) {


      const file = path.split("/").pop();


      const segment = await fetch(R2_BASE + file);


      if (!segment.ok) {

        return new Response("Segmento no encontrado", {
          status:404
        });

      }


      return new Response(segment.body, {

        headers:{
          "Content-Type":"video/mp2t",
          "Access-Control-Allow-Origin":"*",
          "Cache-Control":"public,max-age=30"
        }

      });


    }



    return new Response("Not Found", {
      status:404
    });


  }
};
