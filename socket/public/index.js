const socket = io()

let loader = document.createElement("div")
loader.classList.add("loader")

socket.on('question', (question) => {
    swal({
        title: question.text,
        buttons: {
            1: {
                text: question.answers[0],
                value: 1,
            },
            2: {
                text: question.answers[1],
                value: 2,
            },
            3: {
                text: question.answers[2],
                value: 3,
            },
            4: {
                text: question.answers[3],
                value: 4,
            }
        },
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(answer => {
        socket.emit("answer", question.answers[answer - 1]) // We subtract 1 because arrays start at 0 and not 1
        swal({
            title: "Esperando que respondan los demás participantes",
            buttons: false,
            content: loader,
            closeOnClickOutside: false,
            closeOnEsc: false
        })
    })
})

socket.on('connected', async _ => {
    let name = '';
    while (!name) {
        name = await swal({
            title: "Ingresa tu nombre de usuario:",
            content: {
                element: "input",
                attributes: {
                    placeholder: "Nombre",
                    type: "text",
                    required: true
                }
            },
            button: {
                text: "Join",
                closeModal: false
            },
            closeOnClickOutside: false,
            closeOnEsc: false
        });

        if (!name) {
            swal("Por favor, ingresa tu nombre de usuario");
        }
    }

    socket.emit("name", name);
    
    swal({
        title: "Esperando al host",
        buttons: false,
        content: loader,
        closeOnClickOutside: false,
        closeOnEsc: false
    });
});

socket.on("correct", async _ => {
    swal({
        title: "Correcto!",
        text: "Bien hecho :)",
        icon: "success",
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false
    })
})

socket.on("incorrect", async _ => {
    swal({
        title: "Incorrecto!",
        text: "Suerte la próxima vez :(",
        icon: "error",
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false
    })
})

socket.on("noAnswer", async _ => {
    swal({
        title: "Tiempo acabado!",
        text: "Piensa más rápido velocista",
        icon: "error",
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false
    })
})

socket.on("gameover", async (leaderboard) => {
    let leaderboardDisplay = document.createElement("ul")
    for (player of leaderboard) {
        leaderboardDisplay.innerHTML += `<li>${player[0]}: ${player[1]}</li>`
    }
    swal({
        title: "Game over!",
        icon: "info",
        content: leaderboardDisplay,
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false
    })  
})