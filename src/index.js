const R2_BASE =
"https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/";

const PLAYLIST =
R2_BASE + "index.m3u8";


const DELAY_SEGMENTS = 5;


export default {

async fetch(request) {


  const url = new URL(request.url);


  if (url.pathname.endsWith("index.m3u8")) {


    const response = await fetch(PLAYLIST);


    let text = await response.text();


    let lines = text.split("\n");


    let header = [];
    let segments = [];


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



    // retrasar 5 segmentos

    if(segments.length > DELAY_SEGMENTS){

      segments =
      segments.slice(
        0,
        segments.length - DELAY_SEGMENTS
      );

    }



    let output = [];



    // conservar encabezados

    for(const h of header){

      if(h.trim() !== ""){

        output.push(h);

      }

    }



    // agregar segmentos con URL completa R2

    for(const seg of segments){


      output.push(seg[0]);


      let file = seg[1];


      if(file && file.trim() !== ""){


        output.push(
          R2_BASE + file
        );


      }


    }



    return new Response(
      output.join("\n"),
      {
        headers:{

          "Content-Type":
          "audio/x-mpegurl",

          "Access-Control-Allow-Origin":
          "*",

          "Cache-Control":
          "no-cache, no-store, must-revalidate"

        }

      }

    );


  }



  return new Response(
    "Fenix HLS Worker OK",
    {
      headers:{
        "Content-Type":"text/plain"
      }
    }
  );


}

};
