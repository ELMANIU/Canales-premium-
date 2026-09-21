export default {
  async fetch(request) {

    const base = "https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/";

    const playlist = await fetch(base + "index.m3u8");

    let text = await playlist.text();

    // Reescribir segmentos .ts
    text = text.replace(
      /^(?!#)(.*\.ts.*)$/gm,
      line => {
        if (line.startsWith("http")) return line;
        return base + line;
      }
    );

    return new Response(text, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache"
      }
    });
  }
}
