export default {
  async fetch(request) {

    const playlistUrl = "https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/index.m3u8";

    const response = await fetch(playlistUrl);

    let playlist = await response.text();

    playlist = playlist.replace(
      "#EXTM3U",
      "#EXTM3U\n#EXT-X-START:TIME-OFFSET=-30"
    );

    return new Response(playlist, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "no-cache"
      }
    });
  }
};
