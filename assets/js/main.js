// Cargar header desde partials/header.html
fetch('partials/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;
    })
    .catch(err => console.error('Error cargando el header:', err));

// Cargar navbar desde partials/navbar.html
fetch('partials/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
    })
    .catch(err => console.error('Error cargando el navbar:', err));

// Cargar footer desde partials/footer.html
fetch('partials/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-container').innerHTML = data;
    })
    .catch(err => console.error('Error cargando el footer:', err));