const socket = io();
const tableBody = document.querySelector('#table-body');

socket.on( 'change-in-products', (products) => {
  tableBody.innerHTML = '';

  console.log(products)

  products.forEach( product => {

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${ product._id }</td>
      <td>${ product.title }</td>
      <td>${ product.description }</td>
      <td>${ product.price }</td>
      <td>${ product.thumbnail || "" }</td>
      <td>${ product.code }</td>
      <td>${ product.stock }</td>
    `;

    tableBody.appendChild(row);
  });

});