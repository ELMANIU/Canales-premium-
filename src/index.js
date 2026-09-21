const R2_BASE = "https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/";

export default {
  async fetch(request) {

    const url = new URL(request.url);
    let path = url.pathname;

    // quitar /
    path = path.replace(/^\/+/, "");

    // playlist
    if (path === "" || path === "index.m3u8") {

      const res = await fetch(R2_BASE + "index.m3u8");
      let text = await res.text();

      // retrasar 5 segmentos
      let lines = text.split("\n");

      let segments = [];
      let output = [];

      for (let line of lines) {
        if (line.endsWith(".ts")) {
          segments.push(line);
        }
      }

      let skip = Math.max(0, segments.length - 5);

      let count = 0;

      for (let line of lines) {

        if (line.endsWith(".ts")) {

          if (count < skip) {
            count++;
            continue;
          }

          output.push(line);

        } else {
          output.push(line);
        }

      }

      return new Response(output.join("\n"), {
        headers:{
          "Content-Type":"application/x-mpegURL",
          "Access-Control-Allow-Origin":"*",
          "Cache-Control":"no-cache"
        }
      });

    }


    // segmentos TS
    if (path.endsWith(".ts")) {

      const file = path.split("/").pop();

      const res = await fetch(R2_BASE + file);

      return new Response(res.body,{
        headers:{
          "Content-Type":"video/mp2t",
          "Access-Control-Allow-Origin":"*",
          "Cache-Control":"public,max-age=60"
        }
      });

    }


    return new Response("Not found",{status:404});

  }
};
