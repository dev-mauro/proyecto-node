const tableBody = document.querySelector('#table-body');
const notify = document.querySelector('#notify');

const fetchUsers = async() => {
  const response = await fetch('/api/users');
  const { payload } = await response.json();

  tableBody.innerHTML = '';

  payload.forEach( user => {
    tableBody.appendChild( getTableRow(user) );
  });
}

const getTableRow = ( user ) => {
  const tableRow = document.createElement('tr');

  const nameCell = document.createElement('td');
  nameCell.textContent = user.first_name || 'No especificado';

  const lastnameCell = document.createElement('td');
  lastnameCell.textContent = user.last_name || 'No especificado';

  const emailCell = document.createElement('td');
  emailCell.textContent = user.email;

  const toggleRoleButton = document.createElement('button');
  toggleRoleButton.textContent = 'Cambiar Rol';
  toggleRoleButton.addEventListener('click', getToggleRoleFunction(user));
  
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Eliminar';
  deleteButton.addEventListener('click', getDeleteFunction(user));
  
  const actionsCell = document.createElement('td');
  actionsCell.appendChild( toggleRoleButton );
  actionsCell.appendChild( deleteButton );

  tableRow.appendChild( nameCell );
  tableRow.appendChild( lastnameCell );
  tableRow.appendChild( emailCell );
  tableRow.appendChild( actionsCell );

  return tableRow;
}

const getToggleRoleFunction = ( user ) => {
  return async() => {
    const response = await fetch(`/api/users/premium/${user._id}`);
    const data = await response.json();

    notify.style.visibility = 'visible';
    const { message } = data;
    if( message === 'Admin users cannot be premium' )
      notify.textContent = `No se pudo actualizar el usuario ${user.email} debido a que es el administrador.`;
    else if( message === 'User must have all documents uploaded' )
      notify.textContent = `No se pudo actualizar el usuario ${user.email} debido a que no posee todos los documentos subidos.`;
    else if( message === 'User role updated successfully' ){
      notify.textContent = `Se actualizó el usuario ${user.email} correctamente.`;
      fetchUsers();
    }
    else
      notify.textContent = `Error al intentar actualizar el usuario ${user.email}.`;
  }
}

const getDeleteFunction = ( user ) => {
  return async() => {
    const response = await fetch(`/api/users/${user._id}`, {
      method: 'DELETE',
    });

    const { status } = response;

    notify.style.visibility = 'visible';

    if( status === 400 )
      notify.textContent = `Error al intentar eliminar el usuario ${user.email}.`;
    else if( status === 200 ){
      notify.textContent = `Se eliminó el usuario ${user.email} correctamente.`;
      fetchUsers();
    }
    else if( status === 401 ){
      notify.textContent = `No se puede eliminar el usuario ${user.email} debido a que es el administrador.`;
    }
  }
}

fetchUsers();