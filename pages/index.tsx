import type { NextPage } from "next";
import Navbar from "../components/Navbar/Navbar";
import contractABI from "../artifacts/contracts/PremierOctetERC721A.sol/PremierOctetERC721A.json";
import useEthersProvider from "../hooks/useEthersProvider";
import { ethers } from "ethers";
import { Button, Text, Flex, Spinner } from "@chakra-ui/react";
import { useState } from "react";

const Home: NextPage = () => {
	const { provider, address } = useEthersProvider();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const mint = async () => {
		setIsLoading(true);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(
			"0x6B5067c2F4FbFa3711d4EF76237219CBe554A1B2",
			contractABI.abi,
			signer
		);
		const overrides = {
			from: address,
			value: "20000000000000000",
		};

		try {
			const mintNft = await contract.publicSaleMint(address, 1, overrides);
			await mintNft.wait();
			setIsLoading(false);
		} catch (err) {
			console.log(err);
			setIsLoading(false);
		}
	};

	const activateSale = async () => {
		setIsLoading(true);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(
			"0x6B5067c2F4FbFa3711d4EF76237219CBe554A1B2",
			contractABI.abi,
			signer
		);

		try {
			const activeSale = await contract.setStep(1);
			await activeSale.wait();
			setIsLoading(false);
		} catch (err) {
			console.log(err);
			setIsLoading(false);
		}
	};

	return (
		<>
			<Navbar />
			<Flex w="100%" align="center" my={20} justify="center">
				{isLoading ? (
					<Spinner colorScheme="blue" />
				) : address ? (
					<>
						<Button
							onClick={() => activateSale()}
							fontWeight={800}
							colorScheme="blue"
							mx={10}
						>
							Start Sale
						</Button>
						<Button
							onClick={() => mint()}
							fontWeight={800}
							colorScheme="blue"
							mx={10}
						>
							Mint an NFT
						</Button>
					</>
				) : (
					<Text fontSize={30} fontWeight="bold">
						Vous devez connecter votre wallet
					</Text>
				)}
			</Flex>
		</>
	);
};

export default Home;
