import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { EthersProvider } from "../context/ethersProviderContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<EthersProvider>
			<ChakraProvider>
				<Component {...pageProps} />
			</ChakraProvider>
		</EthersProvider>
	);
}

export default MyApp;
