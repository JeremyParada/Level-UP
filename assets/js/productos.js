const productos = [
  { codigo: "JM001", categoria: "Juegos de Mesa", nombre: "Catan", precio: 29990, imagen: "assets/img/catan.jpg" },
  { codigo: "JM002", categoria: "Juegos de Mesa", nombre: "Carcassonne", precio: 24990, imagen: "assets/img/carcassonne.jpg" },
  { codigo: "AC001", categoria: "Accesorios", nombre: "Controlador Inalámbrico Xbox Series X", precio: 59990, imagen: "assets/img/xbox-controller.jpg" },
  { codigo: "AC002", categoria: "Accesorios", nombre: "Auriculares Gamer HyperX Cloud II", precio: 79990, imagen: "assets/img/hyperx-cloud-ii.jpg" },
  { codigo: "CO001", categoria: "Consolas", nombre: "PlayStation 5", precio: 549990, imagen: "assets/img/ps5.jpeg" },
  { codigo: "CG001", categoria: "Computadores Gamers", nombre: "PC Gamer ASUS ROG Strix", precio: 1299990, imagen: "assets/img/asus-rog.jpg" },
  { codigo: "SG001", categoria: "Sillas Gamers", nombre: "Silla Gamer Secretlab Titan", precio: 349990, imagen: "assets/img/secretlab-titan.jpg" },
  { codigo: "MS001", categoria: "Mouse", nombre: "Mouse Gamer Logitech G502 HERO", precio: 49990, imagen: "assets/img/logitech-g502.jpg" },
  { codigo: "MP001", categoria: "Mousepad", nombre: "Mousepad Razer Goliathus Extended Chroma", precio: 29990, imagen: "assets/img/razer-goliathus.jpg" },
  { codigo: "PP001", categoria: "Poleras Personalizadas", nombre: "Polera Gamer Personalizada 'Level-Up'", precio: 14990, imagen: "assets/img/polera-levelup.jpg" },
  { codigo: "PG001", categoria: "Polerones Gamers Personalizados", nombre: "Poleron Gamer Personalizado 'Level-Up'", precio: 29990, imagen: "assets/img/poleron-levelup.jpeg" },
];

const catalogo = document.getElementById("catalogo");

productos.forEach(p => {
  const card = document.createElement("div");
  card.className = "col";
  card.innerHTML = `
    <div class="card shadow-sm h-100">
      <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
      <div class="card-body">
        <h5 class="card-title">${p.nombre}</h5>
        <p class="card-text">
          <strong>Categoría:</strong> ${p.categoria}<br>
          <strong>Código:</strong> ${p.codigo}<br>
          <strong>Precio:</strong> $${p.precio.toLocaleString("es-CL")} CLP
        </p>
        <div class="d-flex justify-content-between align-items-center">
          <button class="btn btn-sm btn-primary">Agregar al carrito</button>
        </div>
      </div>
    </div>
  `;
  catalogo.appendChild(card);
});
