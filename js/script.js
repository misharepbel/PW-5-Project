const video = document.getElementById('bg');
const src =
    window.innerWidth >= 1024
        ? '../media/7988175-hd_2048_1080_25fps.mp4'
        : '../media/7984191-hd_720_1366_25fps.mp4';

video.src = src;
