const R2_PUBLIC = "https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales";


export default {

async fetch(request) {


const url = new URL(request.url);

const path = url.pathname.replace(/^\/+/,"");



// ==========================
// PLAYER DINÁMICO
// ==========================

// ==========================
// PANEL ADMIN
// ==========================

const ADMIN_KEY = "FENIX2026";


if(path === "admin"){


const key = url.searchParams.get("key");


if(key !== ADMIN_KEY){

return new Response(
"Acceso denegado",
{
status:403,
headers:{
"Content-Type":"text/plain"
}
}
);

}



const html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>Fénix TV Admin</title>


<style>

body{

background:#111;
color:white;
font-family:Arial;
padding:30px;

}


.card{

background:#222;
padding:20px;
border-radius:10px;
max-width:600px;

}


input{

width:100%;
padding:10px;
margin:8px 0;
border-radius:5px;

}


button{

padding:12px;
background:#e50914;
color:white;
border:0;
border-radius:5px;
cursor:pointer;

}

</style>


</head>


<body>


<div class="card">

<h1>🔥 Fénix TV Admin</h1>


<h3>Crear canal</h3>


<label>Nombre del canal</label>

<input placeholder="warner">


<label>URL M3U8</label>

<input placeholder="https://fuente.m3u8">


<button>
CREAR CANAL
</button>


<hr>


<h3>Estado</h3>

<p>
Aquí después mostraremos:
</p>

<ul>

<li>FFmpeg</li>

<li>R2</li>

<li>Worker</li>

</ul>


</div>


</body>

</html>

`;



return new Response(html,{
headers:{
"Content-Type":"text/html;charset=UTF-8"
}
});


}

if(path === "" || path === "player.html"){


const canal =
url.searchParams.get("canal") || "espn";


const html = `

<!DOCTYPE html>

<html>

<head>

<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Fénix TV - ${canal}</title>


<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>


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

}

</style>


</head>


<body>


<video id="video" controls autoplay></video>


<script>


const video =
document.getElementById("video");


const stream =
"/${canal}/index.m3u8";



if(Hls.isSupported()){


const hls =
new Hls({

liveSyncDurationCount:3

});


hls.loadSource(stream);

hls.attachMedia(video);



}

else{


video.src=stream;


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



// ==========================
// VALIDAR CANAL
// ==========================


let partes = path.split("/");


let canal = partes[0];


if(!canal){


return new Response(

"Canal no encontrado",

{status:404}

);


}



let archivo =
partes.slice(1).join("/");


const R2_BASE =
`${R2_PUBLIC}/${canal}/`;




// ==========================
// INDEX M3U8 CON DELAY
// ==========================


if(archivo==="index.m3u8"){



const res =
await fetch(
R2_BASE+"index.m3u8"
);



if(!res.ok){


return new Response(

"Playlist no encontrada",

{status:404}

);


}



let text =
await res.text();



let lines =
text.split("\n");



let segmentos=[];



for(let line of lines){


if(line.trim().endsWith(".ts")){


segmentos.push(line.trim());


}


}



// retraso

const retraso = 5;



const limite =
Math.max(
0,
segmentos.length - retraso
);



let salida=[];


let contador=0;



for(let line of lines){



if(line.trim().endsWith(".ts")){


if(contador < limite){

salida.push(line);

}


contador++;


}

else{


salida.push(line);


}


}



return new Response(

salida.join("\n"),

{


headers:{


"Content-Type":
"application/x-mpegURL",


"Access-Control-Allow-Origin":
"*",


"Cache-Control":
"no-cache,no-store"


}


}


);



}




// ==========================
// SEGMENTOS TS
// ==========================


if(archivo.endsWith(".ts")){


const res =
await fetch(
R2_BASE+archivo
);



if(!res.ok){


return new Response(

"Segmento no encontrado",

{status:404}

);


}



return new Response(

res.body,

{


headers:{


"Content-Type":
"video/mp2t",


"Access-Control-Allow-Origin":
"*",


"Cache-Control":
"public,max-age=20"


}


}


);



}




return new Response(

"Fénix TV Worker Multi Canal OK"

);



}

};
