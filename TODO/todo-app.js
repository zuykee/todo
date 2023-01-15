(function()  {
    
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

   

  function createTodoItem(obj) {
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
        const currentName = item.firstChild.textContent;

        for (const listItem of memory) {
            if (listItem.id == obj.id) {listItem.done = !listItem.done;}
        }
        saveList(memory, listName);
       });
       deleteButton.addEventListener("click", function() {
        if (confirm('точно?')) {
        item.remove();
        const currentName = item.firstChild.textContent;
            for (let i=0;i<memory.length;i++) {
                if (memory[i].id == obj.id) {memory.splice(i,1);} 
            }
            saveList(memory, listName);
        }
        
       });
    
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.appendChild(buttonGroup);
    return {
        item,
        doneButton,
        deleteButton,
    };

  }  

  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
        if (item.id > max) {
            max = item.id;
        } 
        
        
    };
    return max+1;
  };

  function saveList(arr, keyName) {
    console.log(JSON.stringify(arr));
    localStorage.setItem(keyName, JSON.stringify(arr));

  }

  function createTodoApp(container, title = 'Список дел', keyName) {
    
       
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        
        listName = keyName;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        // let localData = localStorage.getItem(listName);

        //  if (localData !== null && localData !== '') {memory = JSON.parse(localData);}
        // console.log(memory);
        // for (const itemList of memory) {
        //     let todoItem = createTodoItem(itemList);
        //     todoList.append(todoItem.item);
        // }
    
        todoItemForm.form.addEventListener('submit', function(e){
            e.preventDefault();
            if (!todoItemForm.input.value) {
                return;
            };
            let record = {
                id: getNewID(memory, listName),
                name: todoItemForm.input.value,
                done: false,
    
               }
           
            
           let todoItem = createTodoItem(record);
    
          

          

           memory.push(record);
           saveList(memory,listName);
           todoList.append(todoItem.item);
            todoItemForm.button.disabled = true;
            todoItemForm.input.value = '';
           
        });
    
       
      
    
  }



   
window.createTodoApp = createTodoApp;



})();

