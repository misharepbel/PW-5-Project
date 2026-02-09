document.addEventListener('DOMContentLoaded', function () {
    //Video background
    const video = document.getElementById('bg');
    const src =
        window.innerWidth >= 1024
            ? '../media/7988175-hd_2048_1080_25fps.mp4'
            : '../media/7984191-hd_720_1366_25fps.mp4';
    video.src = src;

    //Login
    const modal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (user && user.isLoggedIn) {
        document.getElementById('login-trigger').style.display = 'none';
        document.getElementById('logout-trigger').style.display = 'block';
        const uname = user.username;
        if (uname.length > 6) {
            document.getElementById('logout-trigger').innerText +=
            ' (' + uname.substring(0, 6) + '...)';
        } else {
            document.getElementById('logout-trigger').innerText +=
            ' (' + uname + ')';
        }
        document.querySelectorAll('.logged-in-only').forEach((element) => {
            element.setAttribute('href', 'saved.html');
            element.style.cursor = 'pointer';
            element.style.color = 'var(--light-blue)';
        });
    }
    else if (window.location.pathname.split('/').pop()==="saved.html"){
        window.location.href = 'index.html';
    }

    document
        .getElementById('login-trigger')
        .addEventListener('click', function (e) {
            e.preventDefault();
            modal.style.display = 'block';
        });

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const userData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            isLoggedIn: true,
            loginTime: new Date().toISOString(),
        };

        localStorage.setItem('user', JSON.stringify(userData));

        modal.style.display = 'none';

        window.location.reload();

        document.getElementById('login-trigger').style.display = 'none';
        document.getElementById('logout-trigger').style.display = 'block';

        const uname = user.username;
        if (uname.length > 6) {
            document.getElementById('logout-trigger').innerText +=
            ' (' + uname.substring(0, 6) + '...)';
        } else {
            document.getElementById('logout-trigger').innerText +=
            ' (' + uname + ')';
        }
        

        document.querySelectorAll('.logged-in-only').forEach((element) => {
            element.setAttribute('href', 'saved.html');
            element.style.cursor = 'pointer';
            element.style.color = 'var(--light-blue)';
            element.onmouseover() = () => {element.style.color = 'var(--bronze-spice)'}
        });
    });

    //Logout
    document
        .getElementById('logout-trigger')
        .addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('user');

            document.querySelectorAll('.logged-in-only').forEach((element) => {
                element.setAttribute('href', '');
                element.style.cursor = 'not-allowed';
                element.style.color = 'var(--blue-slate)';
            });
            document.getElementById('logout-trigger').style.display = 'none';
            document.getElementById('login-trigger').style.display = 'block';
            document.getElementById('logout-trigger').innerText = 'Log out';

            user.isLoggedIn = false;
            if (window.location.pathname.split('/').pop()==="saved.html") {
                window.location.href = 'index.html';
            } else {
                window.location.reload();
            }
            
        });
});
