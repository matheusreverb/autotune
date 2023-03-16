const { Point, mouse, screen, imageResource, Button, sleep } = require("@nut-tree/nut-js");
require("@nut-tree/template-matcher");

screen.config.resourceDirectory = `${__dirname}/assets`;

let controlerAsyncFunc = 0;
let index = 0;

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
async function testCongrat(index, coordinates) {
    try {
        await screen.find(imageResource("congrat.png"))
        console.log("Achei a imagem Congratulations")
        controlerAsyncFunc = 0
        controlMaxTune(index, coordinates)

    }
    catch (e) {
        testFail(index, coordinates)
    }
}

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

function controlMaxTune(index, coordinates) {
    if (index < coordinates.itens.length) {
        tuneSucess(index, coordinates)
    } else {
        for (let i = 0; i < coordinates.itens.length; i++) {
            if (coordinates.itens[i].nivel < maxTune) {
                tryTuneItem(index, coordinates)
                break
            } else {
                continue
            }
        }
    }
}

function tuneSucess(index, coordinates) {
    coordinates.itens[index].nivel += 1;
    try {
        if (coordinates.itens[index].nivel < maxTune) {
            coordinates.itens[index].durability = 100;
            console.log(`Seu item esta V${coordinates.itens[index].nivel} com ${coordinates.itens[index].durability} de Durabilidade!`)
            tryTuneItem(index, coordinates)
        } else {
            console.log(`Seu item chegou no ${maxTune} mudando SLOT`)
            index++
            tryTuneItem(index, coordinates)
        }
    } catch (e) {
        console.error("Erro dentro do programa, contate ao DEV")
    }
}



function tuneFail(index, coordinates) {
    coordinates.itens[index].durability -= 33
    if (coordinates.itens[index].durability > 1) {
        console.log(`Seu item esta V${coordinates.itens[index].nivel} com ${coordinates.itens[index].durability} de Durabilidade!`)
        tryTuneItem(index, coordinates)
    } else {
        console.log(`Seu item esta V${coordinates.itens[index].nivel} com ${coordinates.itens[index].durability} de Durabilidade!`)
        console.log("Vendendo Item")
        sellItem(index, coordinates)
    }

}

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

async function buyItem(index, coordinates) {
    coordinates.itens[index].nivel = 1;
    coordinates.itens[index].durability = 100;
    try {

        await mouse.move([new Point(coordinates.main.buyButton[0], coordinates.main.buyButton[1])])
        await mouse.click(Button.LEFT)
        //FALTA CAPTURAR A DECISÃO DO JOGADOR! 386 545
        await mouse.move([new Point(386, 545)])
        await mouse.click(Button.LEFT)
        await mouse.move([new Point(coordinates.main.secondBuyButton[0], coordinates.main.secondBuyButton[1])])
        await mouse.click(Button.LEFT)
        await sleep(2000)
        await mouse.move([new Point(coordinates.main.tuneButton[0], coordinates.main.tuneButton[1])])
        await mouse.click(Button.LEFT)
        console.log(coordinates.itens[index])
        await sleep(2000)
        await tryTuneItem(index, coordinates)
    } catch (e) {
        console.error("Erro na função buyItem, contate ao DEV!")
    }
}

const maxTune = 3;
const getResolutionX = screen.width();
const getResolutionY = screen.height();

getResolutionX
    .then((width) => {
        getResolutionY
            .then((height) => {
                return { width, height }
                //OBTENDO A LARGURA E ALTURA DA TELA
            })
            .then((resolution) => {
                //DEFINIÇÃO DE COORDENADAS
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
                console.error("Erro na promise, contate ao DEV!")
            })
    })