Drop teaser.mp4 here, then set TEASER to "/video/teaser.mp4" in
app/events/pistonpoweredranch/page.tsx.

Both steps are needed. While TEASER is null the block shows the photograph on
its own, which is deliberate: a <video> with only a poster gives the viewer
player chrome and a 00:00 timer over a still, and reads as broken.

16:9 landscape, H.264, under about 30MB so it starts fast on a phone.
