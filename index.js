const { Point, mouse, screen, imageResource, Button, sleep } = require("@nut-tree/nut-js");
require("@nut-tree/template-matcher");

screen.config.resourceDirectory = `${__dirname}/assets`;

let msgItem = `Seu item do Slot${coordinates.itens[index].slot} está V${coordinates.itens[index].nivel} com ${coordinates.itens[index].durability} de durabilidade!`;
let controlerAsyncFunc = 0;
let index = 0;

/*
 * Função de início.
 * Está função clica no item e em seguida no tune.
 * @param {index} Recebe o indice do item atual.
 * @param {coordinates} Recebe acesso a todas as coordenadas.
 */
async function tryTuneItem(index, coordinates) {
    try {
        await mouse.move([new Point(coordinates.itens[index].coordinateScreen[0], coordinates.itens[index].coordinateScreen[1])])
        await mouse.click(Button.LEFT)
        await mouse.move([new Point(coordinates.main.secondTuneButton[0], coordinates.main.secondTuneButton[1])])
        await mouse.click(Button.LEFT)
        await sleep(5000)
        await testCongrat(index, coordinates)

    } catch (e) {
        console.error("Coordenadas incorretas ou erro no código, contate ao DEV")
    }
}

/*
 * Esta função executa o teste para saber se o item teve êxito em seu encantamento procurando a imagem "congrat.png". 
 */
async function testCongrat(index, coordinates) {
    try {
        await screen.find(imageResource("congrat.png"))
        console.log("Achei a imagem Congratulations")
        controlerAsyncFunc = 0
        tuneSucess(index, coordinates)

    } catch (e) {
        testFail(index, coordinates)
    }
}

/*
 * Verifica se ouve êxito na falha do item, caso não tenha encontrado a imagem,
 * ela irá começar a contar o "controlerAsyncFunc", para não gerar um loop infinito.
 */
async function testFail(index, coordinates) {
    try {
        await screen.find(imageResource("fail.png"))
        console.log("Achei a imagem Fail")
        controlerAsyncFunc = 0
        tuneFail(index, coordinates)

    } catch (e) {
        console.log("Deu erro na função de controle")
        controlerAsyncFunc += 1

        if (controlerAsyncFunc < 2) {
            console.log("Tentando novamente!")
            testCongrat(index, coordinates)

        } else {
            console.error("Não foi encontrada congratulations e fail, contate ao criador do programa!")
        }
    }
}

/*
 * Caso a função tenha êxito em encontrar a imagem e for congratulations esta função é chamada.
 * Esta função é responsável por aumentar o nível do item e a durabilidade dele retornar para 100.
 * É responsável por verificar se o nível do item já alcançou o nível 5, se sim ele irá alterar as coordenadas.
 * É responsável pela finalização do programa caso todos os itens estejam V5.
 */

function tuneSucess(index, coordinates) {
    coordinates.itens[index].nivel += 1;
    coordinates.itens[index].durability = 100;

    if (coordinates.itens[index].nivel < 5 && index < coordinates.itens.length) {
        console.log(msgItem)
        tryTuneItem(index, coordinates)

    } else if (coordinates.itens[index].nivel == 5 && index < coordinates.itens.length) {
        console.log(msgItem)
        index++
        tryTuneItem(index, coordinates)

    } else {
        finallyAllV5(index, coordinates)
    }
}

/*
 * Caso a função tenha êxito em encontrar a imagem e for fail esta função é chamada.
 * Esta função é responsável por diminuir a durabilidade do item em -33
 * Ela também testa o item para ver se o mesmo ainda tem uma durabilidade superior a 1.
 * Se sim, ela mantem o item e tenta tunar novamente, se não, ela irá vender o item.
 */

function tuneFail(index, coordinates) {
    coordinates.itens[index].durability -= 33
    if (coordinates.itens[index].durability > 1) {
        console.log(msgItem)
        tryTuneItem(index, coordinates)

    } else {
        console.log(msgItem)
        console.log("Vendendo Item")
        sellItem(index, coordinates)
    }
}

/*
 * Esta função é chamada somente quando os itens quebraram, então ela irá vender o item.
 * (DENTRO DO JOGO) Ela iá clicar em "SELL" e em seguida irá clicar no item quebrado para vender o mesmo.
 * E irá chamar a função para comprar o item novamente.
 */

async function sellItem(index, coordinates) {
    try {
        await mouse.move([new Point(coordinates.main.sellButton[0], coordinates.main.sellButton[1])])
        await mouse.click(Button.LEFT)
        await sleep(2000)
        await mouse.move([new Point(coordinates.itens[index].coordinateScreen[0], coordinates.itens[index].coordinateScreen[1])])
        await mouse.click(Button.LEFT)
        await sleep(2000)
        await buyItem(index, coordinates)
    } catch (e) {
        console.log("Erro na função sellItem contate ao DEV!")
    }
}

/*
 * Esta função é responsável por comprar o item e mantem o programa em recursão, 
 * até o programa chegar nos requisitos ideais para a finalização.
 * Ela irá resetar o item para nível 1 e 100 de durabilidade
 * (DENTRO DO JOGO)Ela irá clicar no botão buy
 * (DENTRO DO JOGO)Em seguida irá clicar no item que o usuário deseja comprar
 * (DENTRO DO JOGO)Irá clicar no segundo botão buy que irá aparecer
 * (DENTRO DO JOGO)Em seguida irá clicar novamente no botão Tune e irá recomeçar todo o programa.
 */

async function buyItem(index, coordinates) {
    coordinates.itens[index].nivel = 1;
    coordinates.itens[index].durability = 100;
    try {
        await mouse.move([new Point(coordinates.main.buyButton[0], coordinates.main.buyButton[1])])
        await mouse.click(Button.LEFT)
        //FALTA CAPTURAR A DECISÃO DO JOGADOR! 386 545
        await mouse.move([new Point(396, 713)])
        await mouse.click(Button.LEFT)
        await mouse.move([new Point(coordinates.main.secondBuyButton[0], coordinates.main.secondBuyButton[1])])
        await mouse.click(Button.LEFT)
        await sleep(2000)
        await mouse.move([new Point(coordinates.main.tuneButton[0], coordinates.main.tuneButton[1])])
        await mouse.click(Button.LEFT)
        console.log(msgItem)
        await sleep(2000)
        await tryTuneItem(index, coordinates)

    } catch (e) {
        console.error("Erro na função buyItem, contate ao DEV!")
    }
}

/*
 * Está função é responsável pela finalização do programa, ou continuação dependendo do maxTune que o usuário escolheu.
 */
function finallyAllV5(index, coordinates) {
    if (maxTune == 5) {
        console.log("Todos os seus itens estão V5, obrigado por usar!")

    } else if (maxTune == 6) {
        console.log("Quase lá")
        //tryTuneItemV6() A CONSTRUIR

    } else if (maxTune == 7) {
        console.log("Novidades em breve")
        //tryTuneItemV7() A CONSTRUIR
    }
}

/*
 * Declaração de constantes e adquirindo a resolução do computador.
 * Com a resolução adquirimos com precisão as coordenadas de cada monitor. para clicar no item.
 */
const getResolutionX = screen.width();
const getResolutionY = screen.height();


// FUTURAMENTE, ESTOU ESTUDANDO PARA ISSO!!!
// const maxTune = document.querySelector()
// const itemChosenX = document.querySelector()
// const itemChosenY = document.querySelector()

getResolutionX
    .then((width) => {
        getResolutionY
            .then((height) => {
                return { width, height }
            })
            .then((resolution) => {
                const coordWidth = resolution.width
                const coordHeight = resolution.height

                const main = {
                    sellButton: [coordWidth * 15.63 / 100, coordHeight * 25.56 / 100],
                    buyButton: [coordWidth * 7.66 / 100, coordHeight * 25.56 / 100],
                    secondBuyButton: [coordWidth * 49.12 / 100, coordHeight * 44.91 / 100],
                    tuneButton: [coordWidth * 22.40 / 100, coordHeight * 25.56 / 100],
                    secondTuneButton: [coordWidth * 41.41 / 100, coordHeight * 65.93 / 100],
                    itemChosen: "A CONSTRUIR"
                }
                const itens = [
                    {
                        slot: 1,
                        coordinateScreen: [coordWidth * 82.45 / 100, coordHeight * 69.26 / 100],
                        nivel: 1,
                        durability: 100
                    }, {
                        slot: 2,
                        coordinateScreen: [coordWidth * 91.05 / 100, coordHeight * 69.26 / 100],
                        nivel: 1,
                        durability: 100
                    }, {
                        slot: 3,
                        coordinateScreen: [coordWidth * 82.45 / 100, coordHeight * 77.32 / 100],
                        nivel: 1,
                        durability: 100
                    }, {
                        slot: 4,
                        coordinateScreen: [coordWidth * 91.05 / 100, coordHeight * 77.32 / 100],
                        nivel: 1,
                        durability: 100
                    }, {
                        slot: 5,
                        coordinateScreen: [coordWidth * 82.45 / 100, coordHeight * 84.73 / 100],
                        nivel: 1,
                        durability: 100
                    }, {
                        slot: 6,
                        coordinateScreen: [coordWidth * 91.05 / 100, coordHeight * 84.73 / 100],
                        nivel: 1,
                        durability: 100
                    }, {
                        slot: 7,
                        coordinateScreen: [coordWidth * 82.45 / 100, coordHeight * 92.40 / 100],
                        nivel: 1,
                        durability: 100
                    }, {
                        slot: 8,
                        coordinateScreen: [coordWidth * 91.05 / 100, coordHeight * 92.40 / 100],
                        nivel: 1,
                        durability: 100
                    }
                ]

                return { main, itens }
            })
            .then((coordinates) => {

                tryTuneItem(index, coordinates)

            })
            .catch((e) => {
                console.error("Erro na promise, contate ao DEV! Erro:" + e)
            })
    })