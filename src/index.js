const R2_PUBLIC = "https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales";


export default {

async fetch(request) {

const url = new URL(request.url);
const path = url.pathname.replace(/^\/+/,"");


// ==========================
// PLAYER
// ==========================

if(path === "player.html" || path === "") {

return new Response("Player pendiente v2",{
headers:{
"Content-Type":"text/html"
}
});

}


// ==========================
// HLS MULTI CANAL
// ==========================

let partes = path.split("/");


let canal = partes[0];


if(!canal){

return new Response("Canal no encontrado",
{status:404});

}


let archivo = partes.slice(1).join("/");


let R2_BASE = `${R2_PUBLIC}/${canal}/`;



// ==========================
// PLAYLIST
// ==========================

if(archivo==="index.m3u8"){


const res = await fetch(
R2_BASE+"index.m3u8"
);


if(!res.ok){

return new Response(
"Playlist no encontrada",
{status:404}
);

}


let text = await res.text();


let lines=text.split("\n");


let segmentos=[];


for(let line of lines){

if(line.trim().endsWith(".ts")){

segmentos.push(line.trim());

}

}


// retraso 5 segmentos

const retraso=5;


const permitidos =
segmentos.slice(
0,
Math.max(0,segmentos.length-retraso)
);


let salida=[];

let contador=0;


for(let line of lines){


if(line.trim().endsWith(".ts")){


if(contador < permitidos.length){

salida.push(line);

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
"application/x-mpegURL",

"Access-Control-Allow-Origin":"*",

"Cache-Control":
"no-cache,no-store"

}

});


}



// ==========================
// SEGMENTOS TS
// ==========================


if(archivo.endsWith(".ts")){


const res = await fetch(
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

"Access-Control-Allow-Origin":"*",

"Cache-Control":
"public,max-age=20"

}

});


}


return new Response(
"Fénix TV Worker Multi Canal OK"
);


}

};
