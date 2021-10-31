const app = document.querySelector('#app');

app.innerHTML = `
    <div class="todos">
        <div class="todos-header">
            <h3 class="todos-title">TODO LIST</h3>
            <div>
                <p id="par">You have <span class="todos-count"></span> Items to do!! </p>
                <button type="button" class="todos-clear" style="display:none;" >Remove completed items</button>
            </div>
        </div>
        <form class="todos-form" name="todos">
            <input type="text" placeholder="Add your items..." name="todo">
            <small>Write your item!</small>
        </form>
        <ul class="todos-list">
        </ul>
    </div>
`;

const saveInLocalStorage = (todos) => {
// GUARDAR              NAME      PASAR A STR   ITEM
  localStorage.setItem("todos", JSON.stringify(todos))
};



//?Selectores

const root = document.querySelector('.todos'); // CONTAINER
const list = root.querySelector('.todos-list'); // UL
const count = root.querySelector('.todos-count'); 
const clear = root.querySelector(".todos-clear")
const form = document.forms.todos; // FORM
const input = form.elements.todo; // INPUT 

let state = JSON.parse(localStorage.getItem("todos")) || []; 

// HANDLER VIEW      STATE
const renderTodos = (todos) => {   // MOSTRAR LA LISTA EN EL HTML
 
  let listString = '';
  todos.forEach((todo, index) => { // LI
    listString += `
        <li data-id="${index}"${todo.complete ? ' class="todos-complete"' : ""}> 
            <input type="checkbox"${todo.complete ? " checked" : ""}>
            <span>${todo.label}</span>
            <button type="button"></button>
        </li>
      `;
  });
  list.innerHTML = listString; // UL = LIS
  clear.style.display = todos.filter((todo) => todo.complete).length 
  ? "block" // 1++
  : "none"; // IF 0
  count.innerText = todos.filter((todo) => !todo.complete).length  
};

// HANDLER LOGIC

const addTodo = (event) => { // SUBMIT
  event.preventDefault(); // SUBMIT
  const label = input.value.trim(); // SACAR ESPACIOS
  const complete = false;     
  if (label.length === 0) { // SI NO TIENE NADA FORM .ERROR
    form.classList.add('error');
    return;
  }
  form.classList.remove('error'); // SACAR CLASE ERROR EL LABEL TIENE ALGO
  state = [ 
    ...state, // ARRAY - OBJETO
    {
      label, // INPUT VALUE - OTRO OBJETO
      complete, // COMPLETAR
    },
  ];

  //RENDERIZADO DE LOS TODOS
  renderTodos(state);
  input.value = ''; // RESETEAR INPUT
};

// ENTRY POINT - PUNTO DE ENTRADA A LA APP ---- INICIALIZADOR

const updateTodo = ( {target} ) => {
// OBTENEMOS DATA-ID ATRIBUTO
  const id = parseInt(target.parentNode.dataset.id);
// ASIGNAR EL VALOR BOOLEANO AL ATRIBUTO
  const complete = target.checked;
// MARCADO -> TRUE || BLANCO -> FALSE

  state = state.map((todo, index) => { // NUEVO ARRAY ACTUALIZADO
    if (index === id) {
      return {
        ...todo,
        complete,
      };
    }
    return todo;
  });
  console.log(state);
  renderTodos(state);

}

// EDITAR TODO

const editTodo = ( {target} ) => {
  if (target.nodeName.toLowerCase() !== "span") {
    return;
  }

  const id = parseInt(target.parentNode.dataset.id);
  const currentLabel = state[id].label;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentLabel;

  const handlerEdit = (evento) => {
    const label = evento.target.value
    evento.stopPropagation()

    if(label !== currentLabel) {
      state = state.map((todo, index) => {
        if (id === index) {
          return {
            ...todo,
            label,
          };
        }
        return todo;
      })
      renderTodos(state);
      saveInLocalStorage(state);
    }
    evento.target.display = ""; // UNA VEZ CREADO SE BORRA
    evento.target.removeEventListener("change", handlerEdit)
  }

  const handlerBlur = ({target}) => {
    target.display = "";
    input.remove()
    target.removeEventListener("blur", handlerEdit)
  }

  input.addEventListener("change", handlerEdit)
  input.addEventListener("blur", handlerBlur)

  target.parentNode.append(input)
  input.focus()
}


// BORRAR TODO
const deleteTodo = ({ target }) => {
  if (target.nodeName.toLowerCase() !== "button") {
    return;
  }
  const id = parseInt(target.parentNode.dataset.id);
  const label = target.previousElementSibling.innerText;

  if (window.confirm("Are you sure to remove?")) {
    state = state.filter((todo, index) => index !== id);
    renderTodos(state);
    saveInLocalStorage(state)
  }
};

const clearCompletes = () => {
  const todoCompletes = state.filter((todo) => todo.complete).length;
  if (todoCompletes === "0") {
    return;
  } 
  if (window.confirm(`Should ${todoCompletes} todos be removed?`)) {
    state = state.filter((todo) => (!todo.complete));
    renderTodos(state)
    saveInLocalStorage(state)
  }
  
};

// ENTRY POINT - EJECUTAR HANDLERS
function init() {
  renderTodos(state)
  form.addEventListener('submit', addTodo);
  list.addEventListener("change", updateTodo)
  list.addEventListener("dblclick", editTodo)
  list.addEventListener("click", deleteTodo)
  clear.addEventListener("click", clearCompletes)
}

//RUN THE APPPPPPPP!!!!!!!!!
init();