const URL_BASE = 'https://jsonplaceholder.typicode.com/posts';
let post = [];  // iniciamos los posteos como un array vacio


function getData() {
    fetch(URL_BASE)
    .then(response => response.json())
    .then(data => {
        post = data;                                        // guardamos los datos en el array post
        renderPostList()                                    // metodo para mostrar info en pantalla
    })
    .catch(error => console.error('Error al llamar a la API:', error));
}

// llamo a la funcion getData() para mostrar los posteos en cuanto entro a la aplicacion
getData();

function renderPostList() {
    const postList = document.getElementById('postList');
    postList.innerHTML = '';                                // vacio el contenido del UL

    post.forEach(item => {
        const listItem = document.createElement('li');      // creo un <li>
        listItem.classList.add('postItem');                 // agrego una clase al <li>
                                                            // agrego todos los datos de los posteos y los objetos de edicion
        listItem.innerHTML = `
            <strong>${item.title}</strong>                  
            <p>${item.body}</p>
            <button onclick="editPost(${item.id})">Editar</button>
            <button onclick="deletePost(${item.id})">Borrar</button>
            <div id="editForm-${item.id}" class="editForm" style="display:none">
                <label for="editTitle">Titulo</label>
                <input type="text" id="editTitle-${item.id}" value="${item.title}" required>
                <label for="editBody">Comentario</label>
                <textarea id="editBody-${item.id}" required>${item.body}</textarea>
                <button onclick="updatePost(${item.id})">Actualizar</button>
            </div>
        `
        postList.appendChild(listItem);                      // agrego el <li> al UL
    })
}

function postData(item) {
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;
    
    if(postTitle.trim() == '' || postBody.trim() == '') {
        alert('Por favor, ingrese un titulo y un comentario.');
        return;
    }

    fetch(URL_BASE, {
        method: 'POST',
        body: JSON.stringify({                                              // es stringify porque le vamos a pasar un string
            title: postTitle,                                               // titulo que escribir
            body: postBody,                                                 // body que escribir
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(response => response.json())
    .then(data => {
        post.unshift(data);                                                    // agrego el posteo a la lista de posteos con unshift(data) para que se muestre de forma desc los post
        renderPostList();  
        postTitleInput.value = '';
        postBodyInput.value = '';                                                 // renderizo la lista de posteos
    })
    .catch(error => console.log('Error al querer crear posteo: ', error))   // muestro mensaje de error en caso de que algo falle
    
}

function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none'
}

function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    fetch(`${URL_BASE}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: editTitle,
            body: editBody,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(res => res.json())
    .then(data => {
        const index = post.findIndex(post => post.id === data.id);          // busco indice del post modificado para no mostrarlo
        if(index != -1){
            post[index] = data;
        }else{
            alert('Hubo un error al actualizar la informacion del posteo');
        }
        renderPostList();
    })
    .catch(error => console.log('Error al querer actualizar posteo: ', error))   // muestro mensaje de error en caso de que algo falle

}

function deletePost(id){
    fetch(`${URL_BASE}/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if(response.ok){
            post = post.filter(post => post.id != id)
            renderPostList();
        }else{
            alert('Hubo un error y no se pudo eliminar el posteo');
        }
    })
    .catch(error => {
        console.log('Error al querer eliminar posteo: ', error);
    })
}