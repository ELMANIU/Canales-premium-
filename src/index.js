const URL = "https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/index.m3u8";

export default {
 async fetch() {

  const r = await fetch(URL);

  return new Response(await r.text(), {
    headers:{
      "Content-Type":"application/x-mpegURL",
      "Access-Control-Allow-Origin":"*",
      "Cache-Control":"no-cache"
    }
  });

 }
};
