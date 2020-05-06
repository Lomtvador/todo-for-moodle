let namespace

if (typeof browser !== 'undefined')
    namespace = browser
else if (typeof chrome !== 'undefined')
    namespace = chrome
else
    console.error("Can't use WebExtensions API")

function loadExtension() {
    let input = document.createElement("input")
    input.type = 'checkbox'
    input.id = 'extensionCheckbox'
    input.name = 'extensionCheckbox'
    input.checked = false
    input.addEventListener('change', checkboxChange)

    let label = document.createElement("label")
    label.htmlFor = 'extensionCheckbox'
    label.textContent = 'Включить расширение на этой странице?'

    let page = document.querySelector('#page')
    page.prepend(label)
    page.prepend(input)

    namespace.storage.local.get(window.location.href, (p) => {
        if (typeof p[window.location.href] !== 'undefined') {
            document.querySelector('#extensionCheckbox').checked = true
            Todo()
        }
    })
}

loadExtension()

function checkboxChange(checkbox) {
    if (checkbox.target.checked) {
        let obj = {}
        obj[window.location.href] = 1
        namespace.storage.local.set(obj, () => window.location.reload())
    } else {
        namespace.storage.local.remove(window.location.href, () => window.location.reload())
    }
}

function Todo() {
    let regionMain = document.getElementById('region-main')

    regionMain.insertAdjacentHTML('beforeend',
    `
    <h3>Всего: <span id="extensionAllTasks">0</span></h3>
    <h3>Выполнено: <span id="extensionCompleteTasks" style="color: green;">0</span></h3>
    <h3>Не выполнено: <span id="extensionIncompleteTasks" style="color: red;">0</span></h3>
    <h3>Процент выполненного: <span id="extensionRatio">0</span>%</h3>
    `
    )

    let htmlLinks = document.querySelectorAll('li.activity a')

    for (let a of htmlLinks) {
        a.style.color = 'black'
    }

    let tasks = document.querySelectorAll('li.activity')
    let link = new Map()

    function update() {
        let checkbox
        let complete = 0

        for (task of tasks) {
            if (task.classList.contains('forum'))
                continue

            checkbox = link.get(task).checked

            if (checkbox === true) {
                task.style.background = 'lightgreen'
                complete++
            }

            else {
                task.style.background = 'lightsalmon'
            }
        }

        document.getElementById('extensionAllTasks')
            .textContent = tasks.length - 1

        document.getElementById('extensionCompleteTasks')
            .textContent = complete

        document.getElementById('extensionIncompleteTasks')
            .textContent = (tasks.length - 1) - complete

        let extensionRatio = document.getElementById('extensionRatio')
        let ratio = complete / (tasks.length - 1) * 100

        if (ratio >= 75) {
            extensionRatio.style.color = 'green'
        } else if (ratio >= 50) {
            extensionRatio.style.color = '#938723'
        } else {
            extensionRatio.style.color = 'red'
        }

        extensionRatio.textContent = ratio.toFixed(2)
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
            taskList[taskId] = [checkbox ? 1 : 0, ""] // {"10583": [1, "28.04.2020"]}
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
                    link.get(task).checked = t[taskId][0]
                }
                update()
            })
        }
    }

    loadSaved()
}