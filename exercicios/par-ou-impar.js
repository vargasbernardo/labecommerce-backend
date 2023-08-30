// Gerar um numero aleatorio entre 0 e 5
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

let userNumber = Number(process.argv[3])
let userPick = process.argv[2]
let pcNumber = randomNumber(0, 5)
let pcPick 
let total = Number(userNumber + pcNumber)

userPick === 'par' ? pcPick = 'impar' : pcPick = 'par'


if (total % 2 === 0 && userPick === 'par') //cenario 1 
{ 
    console.log(pcNumber);
    console.log(`Você escolheu ${userPick} e o computador escolheu ${pcPick}. O resultado foi ${total}. Você ganhou!`)

} else if (total % 2 === 0 && userPick === 'impar') // cenario 2 
{
    console.log(pcNumber);
    console.log(`Você escolheu ${userPick} e o computador escolheu ${pcPick}. O resultado foi ${total}. Você perdeu!`)

} else if (total % 2 !== 0 && userPick === 'par') // cenario 3
{
    console.log(pcNumber);
    console.log(`Você escolheu ${userPick} e o computador escolheu ${pcPick}. O resultado foi ${total}. Você Perdeu!`);
} else if (total % 2 !== 0 && userPick === 'impar') // cenario 4 
{
    console.log(pcNumber);
    console.log(`Você escolheu ${userPick} e o computador escolheu ${pcPick}. O resultado foi ${total}. Você Ganhou!`);
}
// checar o resultado e o vencedor