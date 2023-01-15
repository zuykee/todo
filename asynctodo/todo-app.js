
    
    let memory = [];
    let listName = '';
    
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
            let form = document.createElement('form');
            let input = document.createElement('input');
            let buttonWrapper = document.createElement('div');
            let button = document.createElement('button');

        form.classList.add('input-group', 'nb-3');
        input.classList.add('form-control');
        input.placeholder = 'Чем хотите заняться?';
        buttonWrapper.classList.add('input-group-append');
        // button.setAttribute('type','button');
        button.classList.add('btn','btn-primary');
        button.textContent = 'Добавить';
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);
        input.addEventListener('input',function(){
            
            if (input.value !== '') {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });
        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
            let list = document.createElement('ul');
            list.classList.add('list-group');
            return list;
    };

   

  function createTodoItemElement(obj, {onDone, onDelete}) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn','btn-danger');
    deleteButton.textContent ='Удалить';
    if(obj.done == true) {
        item.classList.add('list-group-item-success');
    };

    doneButton.addEventListener('click', function() {
       item.classList.toggle('list-group-item-success');
        onDone(obj);
        
       
       });
       deleteButton.addEventListener("click", function() {
        onDelete(obj,item);
        
        
       });
    
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.appendChild(buttonGroup);
    return item;

  }  



 async function createTodoApp(container, title = 'Список дел', keyName) {
    
       
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        const handlers = {
            onDone(todoItem) {
                console.log({todoItem})
                todoItem.done = !todoItem.done;
                fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ done: todoItem.done}),
                    headers: {
                        'Content-type' : 'application/JSON',
                      }
                })
            },
            onDelete(todoItem,element) {
                console.log(todoItem,element);
                if (!confirm('точно?')) {
                    return;
            }
            element.remove();
            fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                    method: 'DELETE',
                    
                })
        }
    }
        
        listName = keyName;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        const response = await fetch('http://localhost:3000/api/todos');
        const todoItemList = await response.json(); 

        todoItemList.forEach(todoItem => {
            const todoItemElement = createTodoItemElement(todoItem,handlers);
            todoList.append(todoItemElement);
        })

       todoItemForm.form.addEventListener('submit', async function(event){
            event.preventDefault();
            console.log(this);
            if (!todoItemForm.input.value) {
                return;
            };

            const response = await fetch('http://localhost:3000/api/todos', {
                method: "POST",
                body: JSON.stringify({
                name: todoItemForm.input.value.trim(),
                owner: 'Me',
              }),
              headers: {
                'Content-type' : 'application/JSON',
              }
            });

            const todoItem = await response.json(); 
           let todoItemElement = createTodoItemElement(todoItem, handlers);
           todoList.append(todoItemElement);
            todoItemForm.button.disabled = true;
            todoItemForm.input.value = '';
          
        });
    
       
      
    
  }



   
window.createTodoApp = createTodoApp;



