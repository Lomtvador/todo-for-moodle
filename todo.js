let namespace

if (typeof browser !== 'undefined')
    namespace = browser
else if (typeof chrome !== 'undefined')
    namespace = chrome
else
    console.error("Can't use WebExtensions API")

let tasks = document.querySelectorAll('li.activity')
let link = new Map()

function update() {
    let checkbox
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
    }
}

function write() {
    let checkbox
    let taskList = {}
    let taskId
    for (task of tasks) {
        if (task.classList.contains('forum'))
            continue

        checkbox = link.get(task).checked
        taskId = (task.id).split('-')[1]
        taskList[taskId] = checkbox ? 1 : 0
    }

    namespace.storage.local.set(taskList)
    update()
}

for (let task of tasks) {
    if (task.classList.contains('forum'))
        continue

    let input = document.createElement("input")
    input.type = 'checkbox'
    input.addEventListener('change', write)
    let child = task.childNodes[0].childNodes[0].childNodes[1].childNodes[0]
    child.prepend(input)

    link.set(task, input)
}

function loadSaved() {
    for (let task of tasks) {
        if (task.classList.contains('forum'))
            continue

        let taskId = (task.id).split('-')[1]
        namespace.storage.local.get(taskId, (t) => {
            if (typeof t[taskId] !== 'undefined') {
                link.get(task).checked = t[taskId]
            }
            update()
        })
    }
}

loadSaved()
