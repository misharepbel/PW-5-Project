document.addEventListener('DOMContentLoaded', function () {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    // Popup alert
    const popupAlert = document.querySelector('.alert-popup');
    const submitButton = document.querySelector("form input[type='submit']");
    const popupAlertText = document.querySelector('.alert-popup p');
    const cross = document.querySelector('.alert-popup-cross-container img')
    const form = document.querySelector('form#movie-form');
    const movieTitleInput = document.querySelector('input#movie-name');
    const movieDescInput = document.querySelector('textarea#movie-desc');

    if (cross) {
        cross.addEventListener('click', () => {
        closePopup();
    })}
    
    if (submitButton) {
        submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        showPopupAlert();
    })}
    
    let closePopupResolver = null;

    function waitForClose() {
        return new Promise(resolve => {
            closePopupResolver = resolve;
        })
    }

    async function showPopupAlert() {
        if (!form.checkValidity()){
            return;
        }
        if (user !== null) {
            movieTitleInput.value = '';
            movieDescInput.value = '';
            const popupIcon = popupAlert.querySelector('.alert-popup-icon-container img');
            popupIcon.src = '../media/green_check_mark.png'
            popupAlertText.style.fontSize = '0.9em';
            popupAlertText.innerHTML = 'Your suggestion submitted successfully. Thank you!'

        }
        popupAlert.style.display = 'block';
        // CHECK WHAT`S WRONG WITH THIS ANIMATION
        await new Promise(resolve => setTimeout(resolve, 100));
        popupAlert.style.opacity = '1';
        await Promise.race([new Promise(resolve => setTimeout(resolve, 10000)),
             waitForClose()
            ]);

        popupAlert.style.display = 'none';
    }

    function closePopup() {
        popupAlert.style.opacity = '0';
        popupAlert.style.display = 'none';

        if (closePopupResolver) {
            closePopupResolver();
            closePopupResolver = null;
        }
    }

    //Validation
    if (movieTitleInput) {
        movieTitleInput.addEventListener('focusout', checkInputValidity);
    }
    if (movieDescInput) {
        movieDescInput.addEventListener('focusout', checkInputValidity);
    }

    function checkInputValidity(e) {
        if (e.target.closest('input#movie-name') === movieTitleInput 
            && !movieTitleInput.validity.valid) {
            const invalidInputs = document.querySelectorAll('input#movie-name ~ p');
            if (invalidInputs.length > 0) {
                return;
            }
            const invalidInputText = document.createElement('p');
            invalidInputText.classList.add('invalid-input-text');
            invalidInputText.innerHTML = "You have to enter film name";
            movieTitleInput.after(invalidInputText);
        } else if (e.target.closest('input#movie-name') === movieTitleInput
            && movieTitleInput.validity.valid 
            && movieTitleInput.nextSibling === document.querySelector('input#movie-name + p')) {
                movieTitleInput.nextElementSibling.remove();
        }

        if (e.target.closest('textarea#movie-desc') === movieDescInput 
            && !movieDescInput.validity.valid) {
            const invalidInputs = document.querySelectorAll('textarea#movie-desc ~ p');
            if (invalidInputs.length > 0) {
                const invalidInputInnerHTML = document.querySelector('textarea#movie-desc + p');
                let length = movieDescInput.value.length;
                invalidInputInnerHTML.innerHTML = `Movie description have to be at least 50 symbols, now ${length}`;
                return;
            }
            const invalidInputText = document.createElement('p');
            invalidInputText.classList.add('invalid-input-text');
            movieDescInput.after(invalidInputText);
            const invalidInputInnerHTML = document.querySelector('textarea#movie-desc + p');
            let length = movieDescInput.value.length;
            invalidInputInnerHTML.innerHTML = `Movie description have to be at least 50 symbols, now ${length}`;
        } else if (e.target.closest('textarea#movie-desc') === movieDescInput
            && movieDescInput.validity.valid 
            && movieDescInput.nextSibling === document.querySelector('textarea#movie-desc + p')) {
                movieDescInput.nextElementSibling.remove();
        }
    }

    //Login
    const modal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');

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
        window.location.href = '/../index.html';
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
                window.location.href = '/../index.html';
            } else {
                window.location.reload();
            }
            
        });
});
