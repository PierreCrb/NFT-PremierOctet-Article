// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

/// @author Premier Octet https://www.premieroctet.com/
/// @title Premier Octet

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ERC721A.sol";

contract PremierOctetERC721A is Ownable, ERC721A, PaymentSplitter {
    using Strings for uint;

    // Toute les étapes de ventes
    enum Step {
        Before,
        PublicSale,
        SoldOut
    }

    // Phase de vente actuel
    // 0 => Avant la vente, mint désactivé
    // 1 => Vente active, mint activé
    // 2 => Soldout, vente terminée
    Step public sellingStep;

    // Nombre total de NFT
    uint private constant MAX_SUPPLY = 3;

    // 0.02 ETH prix de mint
    uint public publicSalePrice = 20000000000000000;
    
    // l'url de votre IPFS (Pinata)
    string public baseURI;

    // Nombre de wallet dans la team
    uint private teamLength;    

    // Lors du déploiement du contrat il faudra fournir les informations présentes dans le constructeur
    constructor(
        address[] memory _team, 
        uint[] memory _teamShares, 
        string memory _baseURI) 
    ERC721A("Premier Octet", "PO") 
    PaymentSplitter(_team, _teamShares) {
        baseURI = _baseURI;
        teamLength = _team.length;
    }

    // Check if caller is user
    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    // Mint un NFT
    function publicSaleMint(address _account, uint _quantity) external payable callerIsUser {
        uint price = publicSalePrice;
        require(price != 0, "Price is 0");
        require(sellingStep == Step.PublicSale, "Public sale is not activated");
        require(totalSupply() + _quantity <= MAX_SUPPLY, "Max supply exceeded");
        require(msg.value >= price * _quantity, "Not enought funds");
        _safeMint(_account, _quantity);
    }

    // Modifier le prix de Mint
    function setPublicSalePrice(uint _publicSalePrice) external onlyOwner {
        publicSalePrice = _publicSalePrice;
    }
    
    // Obtenir l'URI du jeton d'un NFT par son ID
    function tokenURI(uint _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "URI query for nonexistent token");

        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    // Changer la phase de vente
    function setStep(uint _step) external onlyOwner {
        sellingStep = Step(_step);
    }

    // Envoyer tout les Ethereum présents dans le contrat sur les adresses des membres de la team
    function releaseAll() external onlyOwner  {
        for(uint i = 0 ; i < teamLength ; i++) {
            release(payable(payee(i)));
        }
    }
}