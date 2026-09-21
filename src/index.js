const PLAYLIST =
"https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/index.m3u8";


export default {
async fetch(){

const res = await fetch(PLAYLIST);

let text = await res.text();

let lines = text.split("\n");

let segments = [];

let output = [];

for(let line of lines){

if(line.startsWith("#EXTINF")){
segments.push(line);
}
else{
output.push(line);
}

}


// quitar últimos 5 segmentos
let keep = segments.slice(0, segments.length - 5);


let final = output.join("\n") + "\n" + keep.join("\n");


return new Response(final,{
headers:{
"Content-Type":"application/vnd.apple.mpegurl",
"Access-Control-Allow-Origin":"*",
"Cache-Control":"no-cache"
}
});

}

};
