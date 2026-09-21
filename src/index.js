const R2_BASE = "https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/";

export default {
  async fetch(request) {

    const url = new URL(request.url);

    let file = url.pathname.split("/").pop();

    // ==========================
    // PLAYLIST
    // ==========================

    if (file === "index.m3u8" || file === "") {

      const playlist = await fetch(R2_BASE + "index.m3u8");

      if (!playlist.ok) {
        return new Response("No existe playlist", {
          status:404
        });
      }


      let text = await playlist.text();


      // Convertimos segmentos relativos a URL del worker
      const workerURL = url.origin;


      text = text.replace(
        /\.ts/g,
        ".ts"
      );


      let lines = text.split("\n");


      let segments = lines.filter(
        x => x.endsWith(".ts")
      );


      // retraso de reproducción
      const delay = 5;


      const keep = segments.slice(
        0,
        Math.max(0, segments.length - delay)
      );


      let count = 0;
      let output=[];


      for(let line of lines){

        if(line.endsWith(".ts")){

          if(count < keep.length){

            output.push(
              workerURL + "/" + line.trim()
            );

          }

          count++;

        }else{

          output.push(line);

        }

      }


      return new Response(
        output.join("\n"),
        {
          headers:{
            "Content-Type":
            "application/x-mpegURL",
            
            "Access-Control-Allow-Origin":"*",

            "Cache-Control":
            "no-cache"
          }
        }
      );

    }



    // ==========================
    // SEGMENTOS TS
    // ==========================

    if(file.endsWith(".ts")){


      const segment = await fetch(
        R2_BASE + file
      );


      if(!segment.ok){

        return new Response(
          "Segmento no encontrado",
          {
            status:404
          }
        );

      }


      return new Response(
        segment.body,
        {
          headers:{
            "Content-Type":
            "video/mp2t",

            "Access-Control-Allow-Origin":"*",

            "Cache-Control":
            "public,max-age=20"
          }
        }
      );

    }


    return new Response("OK");

  }
};
