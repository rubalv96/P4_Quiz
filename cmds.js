const {log, biglog, errorlog, colorize} = require("./out");
const model = require ('./model');





exports.helpCommand = rl => {
    log("Comandos: ");
    log("   h|help     - Muestra esta ayuda.");
    log("   list       - Listar los quizzes existentes.");
    log("   show <id>  - Muestra la pregunta y la respuesta del quiz indicado");
    log("   add        - Añadir un nuevo quiz interactivo.");
    log("   delete <id>- Eliminar el quiz indicado.");
    log("   edit <id>  - Editar el quiz indicado. ");
    log("   test <id>  - Probar el quiz indicado.");
    log("   p|play     - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("   credits    - Créditos.");
    log("   q|quit     - Salir del programa.");

    rl.prompt();
};


exports.quitCommand = rl => {
    rl.close();
    rl.prompt();

};

exports.addCommand = rl => {
    rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
        rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {
            model.add(question, answer);
            log(` ${colorize( 'Se ha añadido', 'magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
            rl.prompt();
        })
    })
};

exports.listCommand = rl => {
    model.getAll().forEach((quiz, id) => {
        log(`  [${colorize(id, 'magenta')}]: ${quiz.question}`)
    });
    rl.prompt();

};

exports.testCommand = (rl,id) => {
    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro id`);
        rl.prompt();
    }
    else {
        try {

            const quiz = model.getByIndex(id);


            rl.question(`${colorize(quiz.question, 'red')}` + " ", answer => {
                if ((answer || "").trim().toLowerCase() === (quiz.answer || "").trim().toLowerCase()) {
                    log("Correcto", 'green');
                    rl.prompt();
                }
                else {
                    log("Incorrecto", 'red');
                    rl.prompt();
                }
            });
        }

        catch (error) {
            errorlog(error.message);
            rl.prompt();


        }
    }};

exports.playCommand = (rl) => {
    let score = 0;

    let toBeResolved = []; //Aqui guardo los id de todas las preguntas
    let i;
    for (i = 0; i < model.count(); i++) {
        toBeResolved[i] = i;
    }

    const playOne = () => {
    if (toBeResolved.length === 0) {
        log("¡No hay más preguntas por contestar!", 'yellow');
        log("Tu puntuación en aciertos es de: ", 'blue');
        log(score, 'blue');
        rl.prompt();
    }
    else {
        let pos = Math.floor(Math.random() * toBeResolved.length); // Math.random() * size to be resolverd





        let quiz = model.getByIndex(toBeResolved[pos]);

        toBeResolved.splice(pos, 1);

            rl.question(colorize(quiz.question + " ", 'red'), answer => {
                if ((answer || "").trim().toLowerCase() === (quiz.answer || "").trim().toLowerCase()) {

                    log("Correcto", 'magenta');
                    score++;
                    log("¡Llevas " + score + " aciertos!", 'blue');
                    playOne();


                }

                else {
                    log("Incorrecto", 'red');
                    log("¡Fin del juego, has conseguido " + score + " aciertos!", 'blue');
                    rl.prompt();


                }
            });
        }
    };

    playOne();
};



exports.deleteCommand = (rl,id) => {

    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro id. `);
    } else{
        try{
            model.deleteByIndex(id)

        }
        catch(error){
            errorlog(error.message);
        }
    }
    rl.prompt();
};

exports.editCommand = (rl,id) => {
   if(typeof id === "undefined"){
       errorlog(`Falta el parámetro id`);
       rl.prompt();
   }
   else{
       try{

           const quiz = model.getByIndex(id);

           process.stdout.isTTY && setTimeout(() =>{ rl.write(quiz.question)},0);
           rl.question(colorize(' Introduzca una pregunta: ', 'red'), question =>{

               process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
               rl.question(colorize( 'Introduzca la respuesta: ', 'red'), answer => {
                   model.update(id, question, answer);
                   log(`Se ha cambiado el quiz ${colorize(id, 'magenta')} por : ${question} ${colorize(' => ', 'magenta')} ${answer}`);
                   rl.prompt();
               });
           });

       }
       catch(error){
           errorlog(error.message);
           rl.prompt();
       }
   }

};

exports.creditsCommand = rl => {
    log("Autor de la práctica: ");
    log("Rubén Álvarez", 'green');
    rl.prompt();
};




exports.showCommand = (rl,id) => {
    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro id. `);
    } else{
        try{
            const quiz = model.getByIndex(id);
            log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize("=>", 'magenta')} ${quiz.answer}`);

        }
        catch(error){
            errorlog(error.message);
        }
    }
    rl.prompt();
};
