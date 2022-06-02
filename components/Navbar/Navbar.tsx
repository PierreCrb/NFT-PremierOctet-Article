import { Button, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import useEthersProvider from "../../hooks/useEthersProvider";

const Navbar = () => {
	const { connect, address, disconnect } = useEthersProvider();

	return (
		<Flex
			bgColor="black"
			py={5}
			px={[5, 5, 20, 20]}
			w="100%"
			align="center"
			justify="center"
		>
			<Image
				src="/logo.jpg"
				borderRadius={5}
				alt="PremierOctet logo"
				width={[45, 45, 75, 75]}
			/>
			<Text ml={5} color="white" fontSize={[15, 15, 25, 25]} fontWeight={800}>
				Premier Octet NFT
			</Text>
			<Spacer />
			{address ? (
				<Button
					onClick={() => disconnect()}
					fontWeight={800}
					colorScheme="blue"
				>
					{address.substring(0, 6)}...
					{address.substring(address.length - 4, address.length)}
				</Button>
			) : (
				<Button onClick={() => connect()} fontWeight={800} colorScheme="blue">
					Connect Wallet
				</Button>
			)}
		</Flex>
	);
};

export default Navbar;
