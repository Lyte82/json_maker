document.addEventListener('DOMContentLoaded', function(){
    console.log('we alive');
    let json_maker_filename = document.querySelector('.json_maker_filename');
    let form = document.querySelector('form');
    let json_maker_add_btn = document.querySelector('.json_maker_add_btn');
    let json_maker_name = document.querySelector('.json_maker_name');
    let json_maker_option_list = document.querySelector('.json_maker_option_list');
    let json_maker_close_btn = document.querySelector('.json_maker_close_btn');
    let json_maker_entry_count = document.querySelector('.json_maker_entry_count');
    let json_maker_body  = document.querySelector('.json_maker_body');
    let json_maker_modal_container = document.querySelector('.json_maker_modal_container');
    let json_maker_modal_message = document.querySelector('.json_maker_modal_message');
    let json_maker_modal_close_btn = document.querySelector('.json_maker_modal_close_btn');
    let flag = '';

    function makeEntryRecur(number, element){
        if(number == 0) return;
        let entryObj = `<div class="json_maker_entry_container">
                            <input type="text" name="name" placeholder="enter name">
                            <input type="text" name="value" placeholder="enter value">
                            <button class="json_maker_remove_entry_btn">Remove</button>
                        </div>`;
        let entryArray = `<div class="json_maker_entry_container">
                            <input type="text" name="value" placeholder="enter value">
                            <button class="json_maker_remove_entry_btn">Remove</button>
                          </div>`;
        let optionObj = {
            "Object": entryObj,
            "Array": entryArray
        }
        let parser = new DOMParser();
        let doc = parser.parseFromString(optionObj[flag], 'text/html');
        element.appendChild(doc.body.firstChild);
        makeEntryRecur(number - 1, element);
    }

    function getEntryCount(){
        json_maker_entry_count.innerHTML = json_maker_body.children.length;
    }

    function removeChildren(){
        json_maker_body.innerHTML = '';
    }

    function fetchHandler(obj){
        fetch('/send_json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: obj
        })
        .then((res) => res.json())
        .then((data) =>{
            console.log('ti is', data);            
        });
    }

    function callModal(msg){
        json_maker_modal_container.style.display = 'flex';
        json_maker_modal_message.innerHTML = msg;
    }

    function createObj(inputs){
        let obj = {};
        for(let i = 0; i < inputs.length; i += 2){
            obj[inputs[i].value] = inputs[i + 1].value;
        }
        return obj;
    }

    function createArray(inputs){
        let array = [];
        for(let i = 0; i < inputs.length; i++){
            array.push(inputs[i].value);
        }
        return array;
    }

    json_maker_option_list.addEventListener('click', function(event){
        event.preventDefault();
        if(event.target.id !== 'Object' && event.target.id !== 'Array') return;
        form.classList.add('show_form');
        json_maker_name.innerHTML = event.target.id;
        removeChildren();
        getEntryCount();
        flag = event.target.id;
    });

    json_maker_close_btn.addEventListener('click', function(event){
        form.classList.remove('show_form');
    })
let json_maker_save_btn = document.querySelector('.json_maker_save_btn');
     
    json_maker_save_btn.addEventListener('click', function(event){
        event.preventDefault();
        if(event.target.className !== "json_maker_save_btn") return;
        if(json_maker_filename.innerHTML === 'please name this file'){
            callModal('Please enter a name.  The file cannot be saved without a name');
            return;
        }
        if(json_maker_body.children.length === 0){
            callModal('cannot save empty Objects or Arrays');
            return;
        }
        let inputs = document.querySelectorAll('input');
        let filebody = flag === "Object" ? createObj(inputs) : createArray(inputs);
        console.log(JSON.stringify(filebody), json_maker_filename.innerHTML);
        let bodyObj = {filebody:filebody, filename: json_maker_filename.innerHTML}
        fetchHandler(JSON.stringify(bodyObj));
        //TODO
        //make sure an emplty obj is not submitted
        //make sure pressing the return key does not submit
        //fix name div to erase name when it receives focus
    });

    json_maker_filename.addEventListener('focus', function(event){
        event.target.innerHTML = '';
    })

form.addEventListener('submit', function(event){event.preventDefault()})
    json_maker_add_btn.addEventListener('click', function(event){
        event.preventDefault()
        makeEntryRecur(1, json_maker_body);
        getEntryCount();
    });

    document.body.addEventListener('click', function(event){
        if(event.target.className !== 'json_maker_remove_entry_btn') return;
        event.target.parentNode.remove();
        getEntryCount(); 
    });

    json_maker_modal_close_btn.addEventListener('click', function(event){
        json_maker_modal_container.style.display = 'none';
    })
});