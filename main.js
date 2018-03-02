const readline = require('readline');

console.log("CORE Quiz");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'quiz> ',
  completer: (line) => {
  const completions = 'h help add delete edit list test p play credits q quit'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // show all completions if none found
  return [hits.length ? hits : completions, line];
}

});

rl.prompt();

rl.on('line', (line) => {
  
  let args = line.split(" ");
  let cmd = args[0].toLowerCase().trim();
  
  switch (cmd) {
    case '':
      rl.prompt();
      break;
    case 'h':
    case 'help':
      
      helpCommand();
      break;
      
      case 'quit':
      case 'q':
        quitCommand();
        break;
        
      case 'add':
        addCommand();
        break;
        
      case 'list':
        listCommand();
        break;
        
      case 'test':
        testCommand(args[1]);
        break;
        
      case 'play':
      case 'p':
        playCommand();
        break;
      case 'delete' :
        deleteCommand(args[1]);
        break;
      case 'edit' :
        editCommand(args[1]);
        break;
      case 'credits' :
        creditsCommand();
        break;
      case 'show' :
        showCommand(args[1]);
        break;
        
    default:
      defaultCommand();
      break;
  }
  
}).on('close', () => {
  console.log('Adios!');
  process.exit(0);
});


const helpCommand = () => {
      console.log("Comandos: ");
      console.log("   h|help     - Muestra esta ayuda.");
      console.log("   list       - Listar los quizzes existentes.");
      console.log("   show <id>  - Muestra la preguntar y la respuesta del quiz indicado");
      console.log("   add        - Añadir un nuevo quiz interactivo.");
      console.log("   delete <id>- Eliminar el quiz indicado.");
      console.log("   edit <id>  - Editar el quiz indicado. ");
      console.log("   test <id>  - Probar el quiz indicado.");
      console.log("   p|play     - Jugar a preguntar aleatoriamente todos los quizzes.");
      console.log("   credits    - Créditos.");
      console.log("   q|quit     - Salir del programa.")
      
      rl.prompt();
};


const quitCommand = () => {
      rl.close();
      rl.prompt();

};

const addCommand = () => {
      console.log("Añadir un nuevo quiz.");
      rl.prompt();
};

const listCommand = () => {
      console.log("Listar todos los quizzes existentes.");
      rl.prompt();

};

const testCommand = id => {
      console.log(" Probar el quiz indicado");
      rl.prompt();

}

const playCommand = () => {
      console.log("Jugar.");
      rl.prompt();
}

const deleteCommand = id => {
      console.log("Borrar el quiz indicado.");
      rl.prompt();

}

const editCommand = id => {
      console.log("Editar el quiz indicado.");
      rl.prompt();

}

const creditsCommand = () => {
      console.log("Autor de la práctica: ");
      console.log("Rubén Álvarez");
      rl.prompt();
}


const defaultCommand = () => {
      console.log(`Comando desconocido: '${cmd}'`);
      console.log("Use 'help' para ver todos los comandos disponibles");
      rl.prompt();
}

const showCommand = id => {
      console.log("Mostrar el quiz indicado");
      rl.prompt();
}


