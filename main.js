const readline  = require('readline');


const {log, biglog, errorlog, colorize} = require("./out");
const cmds = require("./cmds");

const net = require("net");





net.createServer(socket =>{
        //Mensaje inicial
    console.log("Se ha conectado un cliente desde: " + socket.remoteAddress)
    biglog(socket,'CORE Quiz', 'green');

    const rl = readline.createInterface({
        input: socket,
        output: socket,
        prompt: colorize("quiz >", 'blue'),
        completer: (line) => {
            const completions = 'h help add delete edit list test p play credits q quit'.split(' ');
            const hits = completions.filter((c) => c.startsWith(line));
            // show all completions if none found
            return [hits.length ? hits : completions, line];
        }

    });

    socket
        .on("end", () => {rl.close()} )
        .on("error", () => {rl.close()} );

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

                cmds.helpCommand(socket, rl);
                break;

            case 'quit':
            case 'q':
                cmds.quitCommand(socket, rl);
                break;

            case 'add':
                cmds.addCommand(socket, rl);
                break;

            case 'list':
                cmds.listCommand(socket, rl);
                break;

            case 'test':
                cmds.testCommand(socket, rl,args[1]);
                break;

            case 'play':
            case 'p':
                cmds.playCommand(socket, rl);
                break;
            case 'delete' :
                cmds.deleteCommand(socket, rl, args[1]);
                break;
            case 'edit' :
                cmds.editCommand(socket, rl,args[1]);
                break;
            case 'credits' :
                cmds.creditsCommand(socket, rl);
                break;
            case 'show' :
                cmds.showCommand(socket, rl,args[1]);
                break;

            default:
                log(socket, `Comando desconocido: '${colorize(cmd, 'red')}'`);
                log(socket, `Use ${colorize('help', 'green')} para ver todos los comandos disponibles"`);
                rl.prompt();
                break;
        }

    }).on('close', () => {
        log(socket, 'Adios!');
        //process.exit(0);
    });
})
    .listen(3030);





