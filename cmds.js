const {log, biglog, errorlog, colorize} = require("./out");
const model = require ('./model');





exports.helpCommand = rl => {
    log("Comandos: ");
    log("   h|help     - Muestra esta ayuda.");
    log("   list       - Listar los quizzes existentes.");
    log("   show <id>  - Muestra la preguntar y la respuesta del quiz indicado");
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
    log("Añadir un nuevo quiz.");
    rl.prompt();
};

exports.listCommand = rl => {
    log("Listar todos los quizzes existentes.");
    rl.prompt();

};

exports.testCommand = (rl,id) => {
    log(" Probar el quiz indicado");
    rl.prompt();

}

exports.playCommand = (rl) => {
    log("Jugar.");
    rl.prompt();
}

exports.deleteCommand = (rl,id) => {
    log("Borrar el quiz indicado.");
    rl.prompt();

}

exports.editCommand = (rl,id) => {
    log("Editar el quiz indicado.");
    rl.prompt();

}

exports.creditsCommand = rl => {
    log("Autor de la práctica: ");
    log("Rubén Álvarez", 'green');
    rl.prompt();
}




exports.showCommand = (rl,id) => {
    log("Mostrar el quiz indicado");
    rl.prompt();
}
