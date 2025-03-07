 
//SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.28;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
// Com esta implementação abaixo K3Ltoken tem acesso a todas características e 
// funções compartilhadas pelo contrato ERC20.sol   
    
contract K3Ltoken is ERC20 {	 

constructor() ERC20("K3Ltoken", "K3L"){   // O constructor quando chamado, invocar o constructor de ERC20 com os argumentos nome da moeda e o symbol dela
	_mint(msg.sender, 1000 * 10 ** 18);   // Também já é realizadaa implementação do mint ou seja a criação das moedas e transferência para uma carteira
}   // Essa função _mint é herdade de ERC20 também e espera o endereço da carteira de destino e a quantidade de tokens a serem cunhados.
 

}
 