const R2_URL =
"https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/index.m3u8";

export default {
 async fetch(request){

   const url = new URL(request.url);

   let target = R2_URL;

   if(url.pathname.endsWith(".ts")){
      target =
      "https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev" 
      + url.pathname;
   }


   const response = await fetch(target,{
     headers:{
       "User-Agent":"Roku"
     }
   });


   return new Response(response.body,{
     status:response.status,
     headers:{
       "Content-Type":
       response.headers.get("Content-Type") ||
       "application/vnd.apple.mpegurl",
       "Access-Control-Allow-Origin":"*",
       "Cache-Control":"no-cache"
     }
   });

 }
}
