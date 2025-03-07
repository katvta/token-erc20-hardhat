 
//SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.28;
 
contract k3ltoken {
 

uint private _totalSupply = 10000 * 10 ** 18; //O fornecimento total deste token
string private _name = "k3ltoken"; // O nome do token
string private _symbol = "K3L"; //A sigla do token
uint private _decimals = 18; // O número de casas decimais da menor fração possivel


mapping(address => uint) private _balances; //estrutura mapping do Solidity que permite 
//criar uma lista, onde o endereço de carteira serve como chave apara encontrar seu saldo


//O construtor executa apenas uma vez para que possamos colocar a nossa moeda em circulação
//Fornece toda a sua cunhagem ao dono do contrato
constructor(){
    _balances[msg.sender] = _totalSupply;
}
 

//Funções de leitura de informações
function name() public view returns (string memory){
    return _name;
}
 
function symbol() public view returns (string memory){
    return _symbol;
}
 
function decimals() public view returns (uint8){
    return _decimals;
}
 
function totalSupply() public view returns (uint) {
    return _totalSupply;
}
 

//A função balanceOf espera um endereço e usa para procurar no mapping de balances o saldo do mesmo
// Caso o endereço não exista no mapping ele retornará 0 como saldo
function balanceOf(address owner) public view returns(uint){
    return _balances[owner];
}
 

//função de transferência de fundos de uma carteira para outra
// Nesta função sempre quem está chamando a função é quem está cedendo os seus tokens, o ‘from’.

function transfer(address to, uint value) public returns(bool){
    require(balanceOf(msg.sender) >= value, "Insuficient balance."); // verifica o saldo emissor da transferência e maio que (value)
    _balances[msg.sender] -= value; //decrementando a carteira de origem
    _balances[to] += value; // incrementando a carteira to destinatária
    emit Transfer(msg.sender, to, value); //evento de transferência toda vez que alguma ocorrer
    return true;
}
 
//O evento Transfer que estou emitindo na função acima deve ser definido também no smart contract.
event Transfer(address indexed from, address indexed to, uint value);


// Estrutura de registro de Transferências Delegadas
// Esta estruturação combinando dois níveis de mappings
// No primeiro mapping temos como chave o endereço da carteira que tem os fundos
// Para cada carteira teremos então um novo mapping, com todos os gastadores (spenders) autorizados
// Para cada spender, neste segundo mapping irá trazer a quantia de fundos autorizados.
mapping(address => mapping(address => uint)) private _allowances;

 

// Evento que será emitido a cada aprovação
event Approval(address indexed owner, address indexed spender, uint value);
 

// Função de aprovação
function approve(address spender, uint value) public returns(bool){ // Função approve recebe endereço a ser autorizado, e a quantia autorizada.
    _allowances[msg.sender][spender] = value; // Guarda informações da carteira autorizadora no primeiro nível do mapping 
    emit Approval(msg.sender, spender, value); // Emite o evento de aprovação
    return true;
}
 

// Função que consulta o allowance para um determinado spender em um determinado endereço
function allowance(address _owner, address _spender) public view returns (uint256){
    return _allowances[_owner][_spender];
}
 

// Função transferFrom
//Para remover o allowance basta chamar o approval novamente passando o valor 0 no value
// Isso será registrado no mapping de allowances e não permitirá transferências delegadas daquele endereço

function transferFrom(address from, address to, uint value) public returns(bool){
    require(balanceOf(from) >= value, "Insufficient balance"); // Valida a existência de fundos na carteira do from
    require(allowance(from, msg.sender) >= value, "Insufficient allowance"); // Valida se quem está tentando fazer a transferência delegada tem permissão
    _balances[to] += value; // Incrementando a carteira to destinatária
    _balances[from] -= value; // Decrementando a carteira do from
    emit Transfer(from, to, value); // emissão do evento de transferência
    return true;
}
 



}