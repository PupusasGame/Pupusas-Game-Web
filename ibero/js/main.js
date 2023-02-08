var myCryptos = []; //array de objetos de API coingeko
var myCryptosId = []; //array para guardar el Symbol de las criptomonedas

// -- arrays para guardar temporalmente los datos de los objetos de la API-- //
var tempId = ["Ibero"];
var tempSymbol = ["ibr"];
var tempImg = ["img/logo.png"];
var tempPrice = [12];
// -- -- -- //

// -- Portfolio Crypto to Swapp -- //
var portfolioCrypto = [];
portfolioCrypto.push(new myPortfolioCoins("ibr", 12));
	//simulando estructura para monedas dentro del portafolio
function myPortfolioCoins (id, amount){
	this.id = id
	this.amount = amount;
}
// -- -- -- //

//-- var de id activo en cada Swap modal--//
var myCoinActiveUp;
var myCoinActiveDown;
// -- -- -- //

//Clase Cryptos para almacenar info de los Obj de la API
class Cryptos {

	constructor(id, symbol, image, _current_price){
		this.id = id;
		this.symbol = symbol;
		this.image = image;
		this.current_price = _current_price;
	}
}

//Leer JSON de API y Deserealizar en Obj Cryptos
async function GetCryptos(){
	let api_url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
	const response = await fetch(api_url);
	const data = await response.json();

	//bucle para almacenar los objetos en el array Crypto
	for (var i = 0; i < data.length; i++) {

		tempId.push(data[i].id);
		tempSymbol.push(data[i].symbol);
		tempImg.push(data[i].image);
		tempPrice.push((data[i].current_price));
		myCryptosId.push(tempSymbol[i]);

		myCryptos.push(new Cryptos (tempId[i], tempSymbol[i], tempImg[i], tempPrice[i]));
		
	}
}

//Llamar a la función para crear la lista de obj Crytpos
GetCryptos();


// -- Boton que muestra balance y actualiza la lista de monedas -- //
var balance = 3000;
let flagBalance = false; //trigger para ser clickeado sólo una vez

function ShowBalance(){
	if (flagBalance == false) {

		flagBalance = true;
		document.getElementById("btn-balance").setAttribute("class", "btn btn-success btn-connect");
		document.getElementById("btn-balance").innerHTML = "Connected";
		
		
		//lista de monedas en la etiqueta ul-A
		var elementoLI = document.getElementById("modal_one");
		for (var i = 0; i < 100; i++) {			
			elementoLI.innerHTML += `
				<li><a class="btn"><img src="${myCryptos[i].image}" id="${myCryptos[i].symbol}a" style="width: 50px; height: 50px;"> <span style="margin-left:1.5em"> ${myCryptos[i].id} </span><em style="color:green">$ ${myCryptos[i].current_price}</em> </a></li>
			`;
		}

		//lista de monedas en la etiqueta ul-B
		var elementoLI = document.getElementById("modal_two");
		for (var i = 0; i < 100; i++) {			
			elementoLI.innerHTML += `
				<li name="nombre de este li"><a class="btn"><img src="${myCryptos[i].image}" id="${myCryptos[i].symbol}b" style="width: 50px; height: 50px;"> <span style="margin-left:1.5em"> ${myCryptos[i].id} </span><em style="color:green">$ ${myCryptos[i].current_price}</em> </a></li>
			`;
		}

		ChangeSwapCoinUP(myCryptos[0].symbol);
		ChangeSwapCoinDown(myCryptos[1].symbol);
		ActualizarPortfolio();
	
	}else{
		return;
	}
}

// -- -- -- //

//Agrego un event listener al UL modal one para seleccionar las monedas del selector de arriba
var coinById = document.getElementById("modal_one");
	coinById.addEventListener("click", (e) => {
				if(e.target.tagName === "IMG" ){
					let targetId = e.target.id;
					let coinId = targetId.substring(0, e.target.id.length - 1);
					ChangeSwapCoinUP(coinId);
				}
			});

//Agrego un event listener al UL modal two para seleccionar las monedas del selector de abajo
var coinById = document.getElementById("modal_two");
	coinById.addEventListener("click", (e) => {
				if(e.target.tagName === "IMG" ){
					let targetId = e.target.id;
					let coinId = targetId.substring(0, e.target.id.length - 1);
					ChangeSwapCoinDown(coinId);
					
				}
			});


//elegir la moneda del selector de arriba y su información
function ChangeSwapCoinUP(_id){
	var index = myCryptosId.indexOf(_id);
	myCoinActiveUp = index;

	document.getElementById("img-swap-up").innerHTML=`
	<img  src="${myCryptos[index].image}" width="50px" height="50px">
	`
	document.getElementById("coin-name-up").innerHTML=`
	Swap <strong>${myCryptos[index].id}</strong> amount
	`
	document.getElementById("coin-info-up").innerHTML=`
	Token Price: $ <strong>${myCryptos[index].current_price} </strong>
	`
	let inputUp = document.getElementById("inputCoinUp");
	inputUp.value = "";
	let inputDown = document.getElementById("inputCoinDown");
	inputDown.value = "";
}


//elegir la moneda del selector de abajo y su información
function ChangeSwapCoinDown(_id){
	var index = myCryptosId.indexOf(_id);
	myCoinActiveDown = index;

	document.getElementById("img-swap-down").innerHTML=`
	<img  src="${myCryptos[index].image}" width="50px" height="50px">
	`
	document.getElementById("coin-name-down").innerHTML=`
	Swap <strong>${myCryptos[index].id}</strong> amount
	`
	document.getElementById("coin-info-down").innerHTML=`
	Token Price: $ <strong>${myCryptos[index].current_price} </strong>
	`
	let inputUp = document.getElementById("inputCoinUp");
	inputUp.value = "";
	let inputDown = document.getElementById("inputCoinDown");
	inputDown.value = "";
}


//input on change for coin UP
var input = document.getElementById("inputCoinUp"); 
input.addEventListener('input', updateValueUP);

function updateValueUP(e) {
  CalculateSwapAmountDown(e.srcElement.value);
}

function CalculateSwapAmountDown(_ammount){
	input = document.getElementById("inputCoinDown");
	let price = (myCryptos[myCoinActiveUp].current_price * _ammount) / myCryptos[myCoinActiveDown].current_price;
	price = price.toFixed(8);
	input.value = price;
}

// -- -- -- //


//input on change for coin Down
var input = document.getElementById("inputCoinDown"); 
input.addEventListener('input', updateValueDown);

function updateValueDown(e) {
  CalculateSwapAmountUp(e.srcElement.value);
}

function CalculateSwapAmountUp(_ammount){
	input = document.getElementById("inputCoinUp");
	let price = (myCryptos[myCoinActiveDown].current_price * _ammount) / myCryptos[myCoinActiveUp].current_price;
	price = price.toFixed(8);
	input.value = price;
}

//Colocar el monto máximo de la moneda a cambiar
function MaxAmount(){

	if(flagBalance){
		let idUp = myCryptos[myCoinActiveUp].symbol;
		let inputUp = document.getElementById("inputCoinUp");
		let indexUp;
		
		//Buscar id dentro del portafolio, sino está no solicitar monto MAX !!!!!!!!!
		for (coin of portfolioCrypto) {
				if (coin.id === idUp) {
					indexUp = portfolioCrypto.indexOf(coin);
				}
		}
		
		function esCoinId(coin) {
		    return coin.id == idUp;
		}
		
		if(portfolioCrypto.find(esCoinId) == undefined){
			return;
		}else{
			inputUp.value = portfolioCrypto[indexUp].amount;
			CalculateSwapAmountDown(portfolioCrypto[indexUp].amount);
		}	
			
	}
	
}

// -- -- -- //

//Funcion que agrega una moneda y cantidad al portafolio por el id 
function AgregarCrypto(_idCoin, _amount){
	
 	function esCoinId(coin) {
 		//itsHere = true;
    	return coin.id == _idCoin;
	}

	if(portfolioCrypto.find(esCoinId) == undefined){
		portfolioCrypto.push(new myPortfolioCoins(_idCoin, _amount));
	}else{
		portfolioCrypto.find(esCoinId).amount += _amount;
	}

}

//Función que resta una cantidad a una moneda y la elimina si no tiene fondos
function RestarCantCrypto(_idCoin, _amount){

	for (coin of portfolioCrypto) {
		if (coin.id === _idCoin) {
			
			coin.amount -= _amount
				
			if (coin.amount < 0.00000001) {
				QuitarCrypto(_idCoin);
			}
			
		}
	}
}

//Quitar una moneda por medio de id
function QuitarCrypto(_idCoin){

	for (coin of portfolioCrypto) {
		if (coin.id == _idCoin) {
			coinIndex = portfolioCrypto.indexOf(coin);
			portfolioCrypto.splice(coinIndex, 1);
		}
	}
}

//Actualiza las criptomonedas compradas en el Select del UI Swap
function ActualizarPortfolio(){


document.getElementById("balance").innerHTML = "";

	for (var i = 0; i < portfolioCrypto.length; i++) {
		var coinAmount = portfolioCrypto[i].amount;
		coinAmount = coinAmount.toFixed(8);
		document.getElementById("balance").innerHTML +=
		`<option>${portfolioCrypto[i].id} : ${coinAmount} </option>`;
	}	
}


function SwapTokens(){
	//encontrar el id de arriba
	//encontrar el id de abajo
	let idUp = myCryptos[myCoinActiveUp].symbol;
	let idDown = myCryptos[myCoinActiveDown].symbol;
	
	idUp = idUp.toString();
	idDown = idDown.toString();
	
	var inputUp = document.getElementById("inputCoinUp");
	var inputDown = document.getElementById("inputCoinDown");

	if(inputUp.value !== "" && inputDown.value !== ""){
		
		
			//index según portafolio
			let indexUp;
			let indexDown;
			
			for (coin of portfolioCrypto) {
				if (coin.id === idUp) {
					indexUp = portfolioCrypto.indexOf(coin);
				}
				if (coin.id === idDown) {
					indexDown = portfolioCrypto.indexOf(coin);
				}
			}
			
			//comprar la moneda de abajo

			if(inputUp.value <= portfolioCrypto[indexUp].amount){
				//Restar Cantidad a moneda de arriba
				RestarCantCrypto(idUp, parseFloat(inputUp.value));
				//agregar moneda o sumar cantidad de abajo
				AgregarCrypto(idDown, parseFloat(inputDown.value));
				document.getElementById("notification").innerHTML =
		`<div class="alert alert-success alert-dismissible" role="alert">successful purchase<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
			}else{
				document.getElementById("notification").innerHTML =
		`<div class="alert alert-warning alert-dismissible" role="alert">you don't have enough funds<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
			}
			
			inputUp.value = "";
			inputDown.value = "";
			ActualizarPortfolio();
	}else{
		document.getElementById("notification").innerHTML =
		`<div class="alert alert-info alert-dismissible" role="alert">enter purchase amount<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
	}		
}

// Funcion para cambiar de posición las monedas a intercambiar
function ExchangeCoinsPlace(){

	let idUp = myCryptos[myCoinActiveUp].symbol;
	let idDown = myCryptos[myCoinActiveDown].symbol;

	ChangeSwapCoinUP(idDown);
	ChangeSwapCoinDown(idUp);
}