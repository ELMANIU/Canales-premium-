const R2_PLAYLIST =
"https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/index.m3u8";

const DELAY_SEGMENTS = 5;


export default {
async fetch(request) {

  const url = new URL(request.url);

  // Playlist principal
  if (url.pathname.endsWith("index.m3u8")) {

    const res = await fetch(R2_PLAYLIST);

    let text = await res.text();

    let lines = text.split("\n");


    let header = [];
    let segments = [];


    for(let i=0;i<lines.length;i++){

      if(lines[i].startsWith("#EXTINF")){

        segments.push([
          lines[i],
          lines[i+1]
        ]);

        i++;

      } else {

        header.push(lines[i]);

      }

    }


    // quitar últimos 5 segmentos
    if(segments.length > DELAY_SEGMENTS){

      segments =
      segments.slice(
        0,
        segments.length - DELAY_SEGMENTS
      );

    }


    let output = [];

    output.push(...header);


    // corregir media sequence
    let seqIndex =
    output.findIndex(x =>
      x.startsWith("#EXT-X-MEDIA-SEQUENCE")
    );


    if(seqIndex >=0){

      let old =
      parseInt(
        output[seqIndex].split(":")[1]
      );

      output[seqIndex] =
      "#EXT-X-MEDIA-SEQUENCE:" +
      old;

    }


    for(const seg of segments){

      output.push(seg[0]);
      output.push(seg[1]);

    }


    return new Response(
      output.join("\n"),
      {
        headers:{
          "Content-Type":
          "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin":"*",
          "Cache-Control":"no-cache"
        }
      }
    );

  }


  // segmentos .ts directo a R2

  if(url.pathname.endsWith(".ts")){

    return fetch(
      "https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev"
      + url.pathname
    );

  }


  return new Response("Fenix HLS Worker");

}

};
