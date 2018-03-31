const {log, biglog, errorlog, colorize} = require("./out");
const {models} = require ('./model');

const Sequelize = require('sequelize');



exports.helpCommand = (socket, rl) => {
    //log("Comandos: ", 'green');
    log(socket,"   h|help     - Muestra esta ayuda.", 'green');
    log(socket,"   list       - Listar los quizzes existentes.", 'green');
    log(socket,"   show <id>  - Muestra la pregunta y la respuesta del quiz indicado", 'green');
    log(socket,"   add        - Añadir un nuevo quiz interactivo.", 'green');
    log(socket,"   delete <id>- Eliminar el quiz indicado.", 'green');
    log(socket,"   edit <id>  - Editar el quiz indicado. ", 'green');
    log(socket,"   test <id>  - Probar el quiz indicado.", 'green');
    log(socket,"   p|play     - Jugar a preguntar aleatoriamente todos los quizzes.", 'green');
    log(socket,"   credits    - Créditos.", 'green');
    log(socket,"   q|quit     - Salir del programa.", 'green');

    rl.prompt();
};


exports.quitCommand = (socket, rl) => {
    rl.close();
    socket.end();

};

const makeQuestion= ( rl, text) => {
    return new Sequelize.Promise((resolve, reject) =>{
        rl.question(colorize(text, 'red'), answer =>{
            resolve(answer.trim().toLowerCase());
        });
    });
}

exports.addCommand = (socket,rl) => {
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
            log (socket,`${colorize('Se ha añadido', 'magenta')}: ${quiz.question} ${colorize("=>", 'magenta')} ${colorize(quiz.answer)}`);
        })
        .catch(Sequelize.ValidationError, error =>{
            errorlog(socket,"El quiz es erróneo");
            error.errors.forEach(({message})=>errorlog(socket,message));
        })
        .catch(error =>{
            errorlog(socket,error.message);
        })
        .then(()=>{
            rl.prompt();
        });
};

exports.listCommand = (socket,rl) => {

    models.quiz.findAll()
        .each(quiz => {
                log(socket,`[${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);
            })
        .catch(error =>{
            errorlog(socket,error.message);
        })
        .then(()=>{
            rl.prompt();
        });

};

exports.testCommand = (socket,rl,id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`No existe un quiz asociado al id =${id}.`);
            }

            makeQuestion(rl, ` ${quiz.question} : ` )
                .then(a => {
                    if (a == quiz.answer.trim().toLowerCase()) {
                        log(socket,'Correcto', 'blue');
                    }
                    else {
                        log(socket,'Incorrecto', 'red');
                    }
                    rl.prompt();
                    return quiz;
                });

        })
        .catch(Sequelize.ValidationError, error => {
            errorlog(socket,"El quiz es erróneo");
            error.errors.forEach(({message}) => errorlog(socket,message));
        })
        .catch(error => {
            errorlog(socket,error.message);
        })
        .then(() => {
            rl.prompt();
        });


}

exports.playCommand = (socket,rl) => {
    let score = 0;

    let toBeResolved = []; //Aqui guardo los id de todas las preguntas
    let i = 0;

    models.quiz.findAll()
        .each(quiz => {
            toBeResolved.push(quiz);
        })
        .catch(error => {
            errorlog(socket, error.message);
        }).then(playOne = () => {
        if (toBeResolved.length === 0) {
            log(socket,"¡No hay más preguntas por contestar!", 'yellow');
            log(socket,"Tu puntuación en aciertos es de: ", 'blue');
            log(socket, score, 'blue');
            rl.prompt();
        }
        else {
            let pos = Math.floor(Math.random() * toBeResolved.length); // size to be resolved

            let quiz = toBeResolved[pos];

            toBeResolved.splice(pos, 1);

            makeQuestion(rl, `${quiz.question} : `)
                .then(a => {

                    if (a == quiz.answer.trim().toLowerCase()) {
                        log(socket,"Correcto", 'magenta');
                        score++;
                        log(socket,"¡Llevas " + score + " aciertos!", 'blue');
                        return quiz;
                    }
                    else {
                        log(socket,"Incorrecto", 'red');
                        log(socket,"¡Fin del juego, has conseguido " + score + " aciertos!", 'blue');
                        rl.prompt();
                    }

                })
                .then(playOne);
        }
        ;
    });
};



exports.deleteCommand = (socket,rl,id) => {

    validateId(id)
        .then(id => models.quiz.destroy({where: {id}}))
        .catch(error =>{
            errorlog(socket,error.message);
        })
        .then(() => {
            rl.prompt();
        })
};

exports.editCommand = (socket,rl,id) => {
   validateId(id)
       .then(id => models.quiz.findById(id))
       .then(quiz => {
           if(!quiz){
               throw new Error(`No existe un quiz asociado al id =${id}.`);
           }

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
           log(socket,`Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} por : ${quiz.question} ${colorize('=>', 'red')} ${quiz.answer}`);
       })
       .catch(Sequelize.ValidationError, error =>{
           errorlog(socket,"El quiz es erróneo");
           error.errors.forEach(({message}) => errorlog(socket,message));
       })
       .catch(error =>{
           errorlog(socket,error.message);
       })
       .then(() =>{
           rl.prompt();
       });
};

exports.creditsCommand = (socket,rl) => {
    log(socket,"Autor de la práctica: ");
    log(socket,"RUBEN", 'green');
    rl.prompt();
};


const validateId = (id) =>{
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


exports.showCommand = (socket,rl,id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if(!quiz){
                throw new Error(`No existe un quiz asociado al id =${id}.`);
            }
            log(socket,`[${colorize(quiz.id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);

        })
        .catch(error =>{
            errorlog(socket,error.message);
        })
        .then(()=> {
            rl.prompt();
        });
};
