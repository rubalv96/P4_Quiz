const {log, biglog, errorlog, colorize} = require("./out");
const {models} = require ('./model');

const Sequelize = require('sequelize');

//min 27:39


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

const makeQuestion= (rl, text) => {
    return new Sequelize.Promise((resolve, reject) =>{
        rl.question(colorize(text, 'red'), answer =>{
            resolve(answer.trim());
        });
    });
}

exports.addCommand = rl => {
    makeQuestion(rl, 'Introduzca una pregunta: ')
        .then(q =>{
            return makeQuestion(rl, 'Introduzca la respuesta: ')
                .then(a => {
                    return {question: q, answer:a};
                });
        })
        .then (quiz =>{
            return models.quiz.create(quiz);
        })
        .then ((quiz) => {
            log (`${colorize('Se ha añadido', 'magenta')}: ${quiz.question} ${colorize("=>", 'magenta')} ${colorize(quiz.answer)}`);
        })
        .catch(Sequelize.ValidationError, error =>{
            errorlog("El quiz es erróneo");
            error.errors.forEach(({message})=>errorlog(message));
        })
        .catch(error =>{
            errorlog(error.message);
        })
        .then(()=>{
            rl.prompt();
        });
};

exports.listCommand = rl => {

    models.quiz.findAll()
        .each(quiz => {
                log(`[${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);
            })
        .catch(error =>{
            errorlog(error.message);
        })
        .then(()=>{
            rl.prompt();
        });

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

    validateId(id)
        .then(id => models.quiz.destroy({where: {id}}))
        .catch(error =>{
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        })
};

exports.editCommand = (rl,id) => {
   validateId(id)
       .then(id => models.quiz.findById(id))
       .then(quiz => {
           if(!quiz){
               throw new Error(`No existe un quiz asociado al id =${id}.`);
           }

           process.stdout.isTTY && setTimeout(()=> {rl.write(quiz.question)},0);
           return makeQuestion(rl, ' Introduzca una pregunta: ')
               .then(q =>{
                   process.stdout.isTTY && setTimeout(() =>{rl.write(quiz.answer)},0);
                   return makeQuestion(rl, ' Introduzca la respuesta: ')
                       .then(a =>{
                           quiz.question=q;
                           quiz.answer = a;
                           return quiz;
                       });
           });
       })
       .then(quiz => {
           return quiz.save();
       })
       .then(quiz => {
           log(`Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} por : ${quiz.question} ${colorize('=>', 'red')} ${quiz.answer}`);
       })
       .catch(Sequelize.ValidationError, error =>{
           errorlog("El quiz es erróneo");
           error.errors.forEach(({message}) => errorlog(message));
       })
       .catch(error =>{
           errorlog(error.message);
       })
       .then(() =>{
           rl.prompt();
       });
};

exports.creditsCommand = rl => {
    log("Autor de la práctica: ");
    log("RUBEN", 'green');
    rl.prompt();
};


const validateId = id =>{
    return new Sequelize.Promise((resolve, reject) =>{
        if(typeof id === "undefined"){
            reject(new Error(`Falta el parámetro <id>.`));
        } else {
            id = parseInt(id);
            if (Number.isNaN(id)) {
                reject(new Error(`El valor del parámetro <id> no es un número.`));
            } else{
                resolve(id);
            }
        }
    })
}


exports.showCommand = (rl,id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if(!quiz){
                throw new Error(`No existe un quiz asociado al id =${id}.`);
            }
            log(`[${colorize(quiz.id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);

        })
        .catch(error =>{
            errorlog(error.message);
        })
        .then(()=> {
            rl.prompt();
        });
};
