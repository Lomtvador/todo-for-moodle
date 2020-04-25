let namespace

if (typeof browser !== 'undefined')
    namespace = browser
else if (typeof chrome !== 'undefined')
    namespace = chrome
else
    console.error("Can't use WebExtensions API")

namespace.storage.sync.get('myextrakey', printKey)

function printKey(key) {
    console.log(key)
}

function keyError(err) {
    console.error(err)
}

function handleChange(e) {
    console.log(e.target.checked)
}

let tasks = document.querySelectorAll('li.activity')
let parents = document.querySelectorAll('li.activity div div div div')
let link = new Map() // node + checkbox
/*for (let parent of parents) {
    let input = document.createElement("input")
    input.type = 'checkbox'
    input.onchange = handleChange
    //parent.prepend(input)

    //link.set(tasks[parent.getin])
}
*/

for (let task of tasks) {
    let input = document.createElement("input")
    input.type = 'checkbox'
    input.onchange = handleChange

    link.set(task, input)
}

for (let parent of parents) {
    
}

for (let task of tasks) {
    //const taskId = task.id
    let obj = {}

    obj[task.id] = {
        'date': '20.03.2020',
        'status': 1
    }

    console.log(obj)

    namespace.storage.sync.set(obj)
}

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