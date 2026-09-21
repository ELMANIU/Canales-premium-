const R2_BASE = "https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/";

const STREAM_URL = "https://c218dd5e-canales-premium.elmanuchale.workers.dev/index.m3u8";


export default {

async fetch(request) {

const url = new URL(request.url);
const path = url.pathname.replace(/^\/+/,"");


// ===============================
// PLAYER WEB PARA CHROME
// ===============================

if(path === "player.html" || path === "") {


const html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>Fénix TV</title>

<style>

body{
margin:0;
background:#000;
height:100vh;
display:flex;
align-items:center;
justify-content:center;
}

video{
width:100%;
height:auto;
max-width:1200px;
}

</style>

</head>


<body>


<video id="video" controls autoplay playsinline></video>


<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>


<script>

const video=document.getElementById("video");

const url="${STREAM_URL}";


if(Hls.isSupported()){


const hls=new Hls({

liveSyncDurationCount:5,

liveMaxLatencyDurationCount:10,

enableWorker:true,

lowLatencyMode:false

});


hls.loadSource(url);

hls.attachMedia(video);


hls.on(Hls.Events.MANIFEST_PARSED,()=>{

video.play();

});


}


else if(video.canPlayType("application/vnd.apple.mpegurl")){

video.src=url;

}

</script>


</body>

</html>

`;

return new Response(html,{
headers:{
"Content-Type":"text/html;charset=UTF-8"
}
});

}




// ===============================
// PLAYLIST M3U8
// ===============================


if(path==="index.m3u8"){


const res=await fetch(
R2_BASE+"index.m3u8"
);


if(!res.ok){

return new Response("Playlist error",
{status:404});

}


let text=await res.text();



let lines=text.split("\n");

let segments=[];


for(let line of lines){

if(line.trim().endsWith(".ts")){

segments.push(line.trim());

}

}



// entrar 5 segmentos atrás

const retraso=5;


const permitidos=segments.slice(
0,
Math.max(0,segments.length-retraso)
);



let salida=[];

let contador=0;



for(let line of lines){


if(line.trim().endsWith(".ts")){


if(contador < permitidos.length){

salida.push(line.trim());

}


contador++;


}else{


salida.push(line);


}


}



return new Response(
salida.join("\n"),
{

headers:{

"Content-Type":
"application/x-mpegURL; charset=utf-8",

"Access-Control-Allow-Origin":"*",

"Cache-Control":
"no-cache,no-store"

}

});


}




// ===============================
// SEGMENTOS TS
// ===============================


if(path.endsWith(".ts")){


const nombre=path.split("/").pop();



const res=await fetch(
R2_BASE+nombre
);



if(!res.ok){

return new Response(
"Segment not found",
{status:404}
);

}



return new Response(
res.body,
{

headers:{

"Content-Type":
"video/mp2t",

"Access-Control-Allow-Origin":"*",

"Cache-Control":
"public,max-age=20"

}

});


}




return new Response(
"Fénix TV Worker OK"
);


}

};
