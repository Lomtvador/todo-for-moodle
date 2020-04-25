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

function update() {
    let checkbox
    for (task of tasks) {
        if (task.classList.contains('forum'))
            continue

        checkbox = link.get(task).checked

        // indeterminate

        if (checkbox === true) {
            task.style.background = 'lightgreen'
        }

        else {
            task.style.background = 'lightsalmon'
        }
    }
}

for (let task of tasks) {
    if (task.classList.contains('forum'))
        continue

    let input = document.createElement("input")
    input.type = 'checkbox'
    input.onchange = update
    let child = task.childNodes[0].childNodes[0].childNodes[1].childNodes[0]
    child.prepend(input)

    link.set(task, input)
}

update()

/*
for (let task of tasks) {
    let obj = {}

    obj[task.id] = {
        'date': '20.03.2020',
        'status': 1
    }

    console.log(obj)

    namespace.storage.sync.set(obj)
}
*/
/*
for (let task of tasks) {
    namespace.storage.sync.get(task.id, (t) => {
        console.log(t)
        if (t[task.id]['status'] === 1) {
            document.getElementById(task.id).style.background = 'lightgreen'
        }
    })
}
*/