const R2_PLAYLIST =
"https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/index.m3u8";

const R2_BASE =
"https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/";

const DELAY = 5;


export default {

async fetch(request) {


const res = await fetch(R2_PLAYLIST);

let playlist = await res.text();


let lines = playlist.trim().split("\n");

let segmentPositions = [];


// localizar segmentos .ts

for(let i=0;i<lines.length;i++){

 if(lines[i].endsWith(".ts")){

   segmentPositions.push(i);

 }

}


// quitar últimos 5 segmentos

let remove = segmentPositions.slice(-DELAY);


let filtered = lines.filter((line,index)=>{

 return !remove.includes(index);

});



// convertir rutas ts relativas a absolutas

filtered = filtered.map(line=>{

 if(line.endsWith(".ts")){

   return R2_BASE + line;

 }

 return line;

});


return new Response(
 filtered.join("\n"),
 {
 headers:{
  "Content-Type":"audio/x-mpegurl",
  "Access-Control-Allow-Origin":"*",
  "Cache-Control":"no-cache"
 }
});


}

};
