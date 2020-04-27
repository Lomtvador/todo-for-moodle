let namespace

if (typeof browser !== 'undefined')
    namespace = browser
else if (typeof chrome !== 'undefined')
    namespace = chrome
else
    console.error("Can't use WebExtensions API")

function printKey(key) {
    console.log(key)
}

let tasks = document.querySelectorAll('li.activity')
let link = new Map() // node + checkbox

function getStorage() {
    for (let task of tasks) {
        if (task.classList.contains('forum'))
            continue

        namespace.storage.sync.get(task.id, (t) => {
            console.log(t[task.id].completed)
        })
    }

    console.log('-----')
}

function update() {
    let checkbox
    //let obj = {}
    for (task of tasks) {
        if (task.classList.contains('forum'))
            continue

        checkbox = link.get(task).checked

        if (checkbox === true) {
            task.style.background = 'lightgreen'
        }

        else {
            task.style.background = 'lightsalmon'
        }

        /*obj[task.id] = {
            'completed': checkbox
        }*/
    }

    //namespace.storage.sync.set(obj)

    //getStorage()
}

function write() {
    let checkbox
    let obj = {}
    for (task of tasks) {
        if (task.classList.contains('forum'))
            continue

        checkbox = link.get(task).checked

        obj[task.id] = {
            'completed': checkbox
        }
    }

    namespace.storage.sync.set(obj, () => {
        console.log('saved')
    })

    update()

    //getStorage()
}

for (let task of tasks) {
    if (task.classList.contains('forum'))
        continue

    let input = document.createElement("input")
    input.type = 'checkbox'
    input.onchange = write
    let child = task.childNodes[0].childNodes[0].childNodes[1].childNodes[0]
    child.prepend(input)

    link.set(task, input)
}

function loadSaved() {
    for (let task of tasks) {
        if (task.classList.contains('forum'))
            continue

        namespace.storage.sync.get(task.id, (t) => {
            if (typeof t[task.id] !== 'undefined') {
                link.get(task).checked = t[task.id].completed
            }
            update() // !!!!!!!
        })
    }
}

loadSaved()
