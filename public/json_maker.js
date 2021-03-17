document.addEventListener('DOMContentLoaded', function(){
    let json_maker_filename = document.querySelector('.json_maker_filename');
    let json_maker_option_list = document.querySelector('.json_maker_option_list');
    let json_maker_close_btn = document.querySelector('.json_maker_close_btn');

    let form = document.querySelector('.json_maker_form');
    let json_maker_name = document.querySelector('.json_maker_name');
    let json_maker_entry_count = document.querySelector('.json_maker_entry_count');
    let json_maker_add_btn = document.querySelector('.json_maker_add_btn');
    let json_maker_save_btn = document.querySelector('.json_maker_save_btn');
    let json_maker_body  = document.querySelector('.json_maker_body');

    let json_maker_modal_container = document.querySelector('.json_maker_modal_container');
    let json_maker_modal_message = document.querySelector('.json_maker_modal_message');
    let json_maker_modal_close_btn = document.querySelector('.json_maker_modal_close_btn');

    let json_maker_nest_modal = document.querySelector('.json_maker_nest_modal');
    let json_maker_nest_name = document.querySelector('.json_maker_nest_name');
    let json_maker_nest_entry_count = document.querySelector('.json_maker_nest_entry_count');
    let json_maker_nest_close_btn = document.querySelector('.json_maker_nest_close_btn');
    let json_maker_nest_add_btn = document.querySelector('.json_maker_nest_add_btn');
    let json_maker_nest_save_btn = document.querySelector('.json_maker_nest_save_btn');
    let json_maker_nest_body  = document.querySelector('.json_maker_nest_body');

    let flag = '';
    let name = '';
    let originalName = '';
    let nestFlag = '';
    let nestElement = null;
    let nestTitle = null;

/*-------------------EVENT HANDLERS & HELPER FUNCTIONS---------------------*/
/*-------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------*/
    function makeEntryRecur(number, element, flag, show){
        if(number == 0) return;
        let entryObj = `<div class="json_maker_entry_container">
                            <input type="text" name="name" placeholder="enter name">
                            <input type="text" name="value" placeholder="enter value">
                            <div class="json_maker_nest">
                                <button class="json_maker_nest_remove_btn">x</button>
                                <p class="json_maker_status"><span>Object</span></p>
                                <ul class="json_maker_nest_list">
                                    <li class="json_maker_nest_option"><a href="" id="nestObject">Object</a></li>
                                    <li class="json_maker_nest_option"><a href="" id="nestArray">Array</a></li>
                                </ul>
                            </div>
                            <button class="json_maker_remove_entry_btn"><i class="fas fa-trash"></i></button>
                            <button class="json_maker_nest_btn" style=${show}>Nest</button>
                        </div>`;
        let entryArray = `<div class="json_maker_entry_container">
                            <input type="text" name="value" placeholder="enter value" class="array_input">
                            <div class="json_maker_nest"></div>
                            <button class="json_maker_remove_entry_btn"><i class="fas fa-trash"></i></button>
                            <button class="json_maker_nest_btn" style=${show}>Nest</button>
                          </div>`;
        let optionObj = {
            "Object": entryObj,
            "Array": entryArray
        }
        let parser = new DOMParser();
        let doc = parser.parseFromString(optionObj[flag], 'text/html');
        element.appendChild(doc.body.firstChild);
        //makeEntryRecur(number - 1, element);
    }

    function getEntryCount(){
        json_maker_entry_count.innerHTML = json_maker_body.children.length;
    }

    function getEntryCountNest(){
        json_maker_nest_entry_count.innerHTML = json_maker_nest_body.children.length;
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

/*-------------------EVENT HANDLERS & HELPER FUNCTIONS---------------------*/
/*-------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------*/

/*-------------------------HANDLERS ATTACHED-------------------------------*/
/*-------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------*/
    document.body.addEventListener('click', function(event){
        if(event.target.className !== 'json_maker_remove_entry_btn' && event.target.nodeName !== 'I') return;
        event.target.nodeName === "I" ? event.target.parentNode.parentNode.remove() : event.target.parentNode.remove();
        getEntryCount(); 
    });

    document.body.addEventListener('click', function(event){
        if(event.target.className !== "json_maker_nest_btn") return;
        let parent = event.target.parentNode;
        nestTitle = parent.querySelector('.json_maker_status');
        nestElement = parent.querySelector('input[name="value"]');
        nestElement.style.display = "none";
        parent.querySelector('.json_maker_nest').style.display = 'inline-block';
        event.target.style.display = 'none';

    });

    document.body.addEventListener('click', function(event){
        if(event.target.className !== 'json_maker_nest_remove_btn') return;
        event.target.parentNode.style.display = 'none';
        event.target.parentNode.querySelector('.json_maker_status').style.display = 'none';
        let grandparent = event.target.parentNode.parentNode;
        let input = grandparent.querySelector('input[name="value"]');
        input.removeAttribute('data-nest');
        input.style.display = "inline-block";
        grandparent.querySelector('.json_maker_nest_btn').style.display = "inline-block";

    });

    document.body.addEventListener('click', function(event){
        event.preventDefault()
        if(event.target.id !== 'nestObject' && event.target.id !== 'nestArray') return;
        json_maker_nest_modal.style.display = 'flex';
        json_maker_nest_body.innerHTML = '';
        nestFlag = json_maker_nest_name.innerHTML = event.target.id.slice(4);
        makeEntryRecur(1, json_maker_nest_body, nestFlag, 'display:none');
        getEntryCountNest();
        
    });

    json_maker_filename.addEventListener('keyup', function(event){
        name = event.target.innerHTML;
    });

    json_maker_filename.addEventListener('focus', function(event){
        originalName = name = event.target.innerHTML;
        name === "Please name this file" ? (event.target.innerHTML = '') : (event.target.innerHTML = name);
    });

    json_maker_filename.addEventListener('blur', function(event){
        if(event.target.innerHTML === ""){
            if(name === "") name = originalName;
            event.target.innerHTML = name;
        }
    });

    json_maker_option_list.addEventListener('click', function(event){
        event.preventDefault();
        if(event.target.id !== 'Object' && event.target.id !== 'Array') return;
        form.classList.add('show_form');
        flag = event.target.id;
        json_maker_name.innerHTML = event.target.id;
        removeChildren();
        makeEntryRecur(1, json_maker_body, event.target.id, '');
        getEntryCount();
    });

    json_maker_close_btn.addEventListener('click', function(event){
        form.classList.remove('show_form');
    })

    form.addEventListener('submit', function(event){event.preventDefault()});

    json_maker_add_btn.addEventListener('click', function(event){
        event.preventDefault()
        makeEntryRecur(1, json_maker_body, flag, '');
        getEntryCount();
    });

    json_maker_save_btn.addEventListener('click', function(event){
        event.preventDefault();
        if(event.target.className !== "json_maker_save_btn") return;
        if(json_maker_filename.innerHTML === 'Please name this file'){
            callModal('Please enter a name.  The file cannot be saved without a name');
            return;
        }
        if(json_maker_body.children.length === 0){
            callModal('Cannot save empty files');
            return;
        }
        let inputs = document.querySelectorAll('input');
        let filebody = flag === "Object" ? createObj(inputs) : createArray(inputs);
        console.log(JSON.stringify(filebody), json_maker_filename.innerHTML);
        let bodyObj = {filebody:filebody, filename: json_maker_filename.innerHTML}
        fetchHandler(JSON.stringify(bodyObj));
        //TODO
        //possible allow empty obj and array
        //make nested function for Objs and Arrays
        //make import function
    });

    json_maker_modal_close_btn.addEventListener('click', function(event){
        json_maker_modal_container.style.display = 'none';
    });

    json_maker_nest_close_btn.addEventListener('click', function(event){
        json_maker_nest_modal.style.display = 'none';
    });

    json_maker_nest_add_btn.addEventListener('click', function(event){
        event.preventDefault()
        makeEntryRecur(1, json_maker_nest_body, nestFlag, 'display:none');
        getEntryCountNest();
    });

    json_maker_nest_save_btn.addEventListener('click', function(event){
        event.preventDefault();
        let inputs = event.target.parentNode.parentNode.querySelectorAll('input');
        let filebody = nestFlag === "Object" ? createObj(inputs) : createArray(inputs);
        nestElement.setAttribute('data-nest', JSON.stringify(filebody));
        json_maker_nest_body.innerHTML = '';
        json_maker_nest_modal.style.display = 'none';
        nestTitle.style.display = 'flex';
        nestTitle.innerHTML = nestFlag;
        console.log('merci', filebody, nestElement);

    });
/*-------------------------HANDLERS ATTACHED-------------------------------*/
/*-------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------*/
});