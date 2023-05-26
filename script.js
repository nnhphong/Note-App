const addBox = document.querySelector('.add-box');
const popupBox = document.querySelector('.popup-box');
const addBoxTitle = popupBox.querySelector('.content header p');
const closePopupBox = popupBox.querySelector('.content header i');
const addNoteBtn = popupBox.querySelector('button');
const inpTitle = popupBox.querySelector('input');
const inpDesc = popupBox.querySelector('textarea');

let isUpdate = false, noteUpdateId = null;

const Month = ["January", "Feburary", "March", "April", "May", "June", "August", "September", "October", "November", "December"];

let show = function(e) {
    e.classList.add('show');
}

let close = function(e) {
    e.classList.remove('show');
}

let findIndexById = function(noteId) {
    let left = 0, right = data.length - 1;
    while (left <= right) {
        let mid = Math.ceil((left + right) / 2);
        if (data[mid].id == noteId) {
            return mid;
        }
        else if (data[mid].id > noteId) right = mid - 1;
        else left = mid + 1;
    }
    return -1;
}

addBox.addEventListener("click", () => {
    inpTitle.focus();
    show(popupBox);
});

closePopupBox.addEventListener("click", () => {
    close(popupBox);
    addNoteBtn.innerHTML = "Add Note";
    addBoxTitle.innerHTML = "Add a new Note";
    inpTitle.value = '';
    inpDesc.value = '';
});

addNoteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let txtTitle = inpTitle.value, txtDesc = inpDesc.value;
    if (txtTitle === '' || txtDesc === '') {
        alert("You can't submit the form without filling title or description");
        return;
    }
    let date = new Date();
    let day = date.getDate(), month = Month[date.getMonth()], year = date.getFullYear();

    // push data to localStorage
    let info = {
        title: txtTitle,
        desc: txtDesc,
        date: month + ' ' + day + ', ' + year,
        id: ((data.length == 0 ? 0 : data[data.length - 1].id) + 1),
    }
    
    if (isUpdate) {
        // update data to data array
        info.id = noteUpdateId;
        data[findIndexById(info.id)] = info;
        // update title and description to HTML note
        let note = document.getElementById('note' + info.id).children[0].children;
        note[0].innerHTML = info.title;
        note[1].innerHTML = info.desc.replaceAll('\n', '<br>');

        // for an event handler, should use anonymous function instead of string
        document.querySelector(`#dots-${info.id}`).nextElementSibling.children[0].onclick = function() {
            editNote(info.id, info.title, info.desc);
        }
        document.querySelector(`#note${info.id} .bottom-content .date span`).innerHTML = info.date; 
        isUpdate = false;
    }
    else {
        data.push(info);
        loadData([info]);
    }
    localStorage.setItem('data', JSON.stringify(data));
    // close form when press submit
    closePopupBox.click();
});

// load data from localStorage
let data = JSON.parse((localStorage.getItem('data') || "[]"));
let loadData = function(dat = data) {
    if (dat.length == 0) return;
    dat.forEach((elem) => {
        let note = document.querySelector('.wrapper').lastElementChild;
        // console.log(elem.id, elem.title, elem.desc);
        let filterDesc = elem.desc.replaceAll('\n', '<br>');
        let HTML = `
        <li class="note" id="note${elem.id}">
            <div class="details">
                <p>${elem.title}</p>
                <span>${filterDesc}</span>
            </div>
            <div class="bottom-content">
                <div class="date"><span>${elem.date}</span></div>
                <div class="settings">
                    <i class="uil uil-ellipsis-h" id="dots-${elem.id}"></i>
                    <ul class="menu">
                        <li onclick="editNote(${elem.id}, '${elem.title}', '${elem.desc}')"><i class="uil uil-pen"></i>Edit</li>
                        <li onclick="deleteNote(${elem.id})"><i class="uil uil-trash"></i>Delete</li>
                    </ul>
                </div>
            </div>
        </li>\n`;
        note.insertAdjacentHTML("afterend", HTML);
    });
}

let prvId = null;
document.addEventListener('click', (e) => {
    // click vao dau ...
    if (e.target.id.startsWith("dots-")) {
        let elem = document.getElementById(e.target.id);
        show(elem.parentElement);
        prvId = e.target.id;
    }
});
loadData(); 

// noteId has a form of "{1, 2, ..}"
let deleteNote = function(noteId) {
    if (prvId != null) {
        let elem = document.getElementById(prvId);
        // close box edit/delete
        close(elem.parentElement);
        prvId = null;
    }
    // delete HTML of the node has an id "note + {1, 2, 3}"
    const elem = document.getElementById("note" + noteId);
    elem.remove();         
    deleteNoteData(noteId);
}

let deleteNoteData = function(noteId) {
    let id = findIndexById(noteId);
    data.splice(id, 1);
    localStorage.setItem('data', JSON.stringify(data));
}

let editNote = function(noteId, title, desc) { 
    addBox.click();
    isUpdate = true;
    noteUpdateId = noteId;
    addNoteBtn.innerHTML = "Update Note";
    addBoxTitle.innerHTML = "Update a Note";
    // show the initial value for input box
    inpDesc.value = desc;
    inpTitle.value = title;
}
