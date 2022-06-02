const hre = require("hardhat");

async function main() {
	// Wallet des membres de la team
	let team = ["0x2939cd2d52D6aB2B3cBD3966dA800E7dea69e955"];
	// Pourcentage d'ETH que l'addresse va récupérer après la vente
	let teamShares = [100];
	// Lien des métadonnées IPFS (Pinata)
	let baseURI =
		"https://gateway.pinata.cloud/ipfs/QmX7KKoebxvcpjLqhQ2FhX7bQkTe8uea7iaisYWfy1gWxW/";

	// Déploiement du contrat
	const Raffle = await hre.ethers.getContractFactory("PremierOctetERC721A");
	const raffle = await Raffle.deploy(team, teamShares, baseURI);

	await raffle.deployed();

	console.log("Premier Octet Contract ERC721A deployed to :" + raffle.address);
	console.log(team, teamShares, baseURI);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
