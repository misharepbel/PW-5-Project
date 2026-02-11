//Video background
document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('bg');
    if (window.location.pathname.split('/').pop() === 'index.html') {
        const src =
            window.innerWidth >= 1024
                ? 'media/horizontal.mp4'
                : 'media/vertical.mp4';
        video.src = src;
    } else {
        const src =
            window.innerWidth >= 1024
                ? '../media/horizontal.mp4'
                : '../media/vertical.mp4';
        video.src = src;
    }
});
