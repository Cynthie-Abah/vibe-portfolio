# assets/

Drop media here. Nothing needs a code change — the page detects the files and
upgrades itself.

| Path                        | What                                          |
| --------------------------- | --------------------------------------------- |
| `video/<slug>.mp4`          | The 60-second clip. H.264 + AAC, `+faststart`. |
| `video/<slug>.vtt`          | WebVTT captions. Attached automatically.       |
| `poster/<slug>.jpg`         | Poster frame, 1280×720.                        |
| `../img/cynthia.JPG`        | Hero portrait, ~4:5, ≤200 KB.                  |

**The eight slugs:** `ebook` · `podcast` · `blog` · `translate` · `sentiment` ·
`tour-widget` · `framez` · `audiophile`

Until a clip lands, its card shows a designed slate rather than a broken player.
Export and verify:

```bash
ffmpeg -i raw.mov -vf scale=1280:720 -c:v libx264 -crf 23 -preset medium \
       -c:a aac -b:a 128k -movflags +faststart assets/video/blog.mp4

ffprobe -v error -show_entries format=duration -of csv=p=0 assets/video/blog.mp4
```

If the duration chip on the card turns red, the clip is over the 60-second cap.
