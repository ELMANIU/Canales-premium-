const PLAYLIST =
"https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/index.m3u8";

const DELAY = 5;

export default {
async fetch(request) {

  const res = await fetch(PLAYLIST);

  let m3u8 = await res.text();

  let lines = m3u8.split("\n");

  let segments = [];
  let header = [];

  for(let i = 0; i < lines.length; i++){

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
  if(segments.length > DELAY){
    segments = segments.slice(0, -DELAY);
  }


  let output = [];

  output.push(...header);


  for(const seg of segments){
    output.push(seg[0]);
    output.push(seg[1]);
  }


  return new Response(output.join("\n"),{
    headers:{
      "Content-Type":"audio/x-mpegurl",
      "Access-Control-Allow-Origin":"*",
      "Cache-Control":"no-cache, no-store"
    }
  });

}
};
