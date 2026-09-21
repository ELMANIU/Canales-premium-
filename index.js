export default {
  async fetch(request) {

    const url = "https://pub-31c3df763d1f4f2bbd2602595581aa82.r2.dev/canales/tnthd/index.m3u8";

    const response = await fetch(url);

    let playlist = await response.text();

    // Solo modificar playlists m3u8
    if (playlist.includes("#EXTM3U")) {

      playlist = playlist.replace(
        "#EXTM3U",
        "#EXTM3U\n#EXT-X-START:TIME-OFFSET=-30"
      );

    }

    return new Response(playlist, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });

  }
};
