import React, { useCallback, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useRouter } from "next/router";
import { providers } from "ethers";

interface AppContext {
	address: string;
	provider: providers.Web3Provider;
	disconnect: any;
	connect: any;
	chainId: number;
	loading: boolean;
}

const EthersContext = React.createContext<AppContext | null>(null);

export const EthersProvider = ({ children }: any) => {
	const [address, setAddress] = useState<null | string>(null);
	const [provider, setProvider] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [web3Provider, setWeb3Provider] =
		useState<null | providers.Web3Provider>(null);
	const [chainId, setChainId] = useState<null | number>(null);
	const router = useRouter();

	let web3Modal: Web3Modal;
	if (typeof window !== "undefined") {
		const providerOptions = {
			walletconnect: {
				display: {
					name: "Mobile",
				},
				package: WalletConnectProvider,
				options: {
					infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
				},
			},
		};
		web3Modal = new Web3Modal({
			network: "rinkeby",
			cacheProvider: true,
			providerOptions,
			disableInjectedProvider: false,
		});
	}

	const connect = useCallback(async function () {
		try {
			setLoading(true);
			const provider = await web3Modal.connect();
			const web3Result = new providers.Web3Provider(provider);
			const signer = web3Result.getSigner();
			const address = await signer.getAddress();
			const network = await web3Result.getNetwork();

			setProvider(provider);
			setWeb3Provider(web3Result);
			setAddress(address);
			setChainId(network.chainId);
			setLoading(false);
		} catch {
			console.log("error");
		}
	}, []);

	const disconnect = useCallback(
		async function () {
			setLoading(true);

			await web3Modal.clearCachedProvider();
			if (provider) {
				if (provider.disconnect && typeof provider.disconnect === "function") {
					await provider.disconnect();
				}
			}

			setAddress(null);
			setProvider(null);
			setWeb3Provider(null);
			setChainId(null);
			setLoading(false);
		},
		[provider]
	);

	useEffect(() => {
		if (provider?.on) {
			const handleAccountsChanged = (accounts: any) => {
				console.log("accountsChanged", accounts);
				setAddress(accounts[0]);
			};

			const handleChainChanged = (_hexChainId: any) => {
				router.reload();
			};

			const handleDisconnect = (error: any) => {
				console.log("disconnect", error);
				disconnect();
			};

			provider.on("accountsChanged", handleAccountsChanged);
			provider.on("chainChanged", handleChainChanged);
			provider.on("disconnect", handleDisconnect);

			return () => {
				if (provider.removeListener) {
					provider.removeListener("accountsChanged", handleAccountsChanged);
					provider.removeListener("chainChanged", handleChainChanged);
					provider.removeListener("disconnect", handleDisconnect);
				}
			};
		}
	}, [provider, disconnect]);

	return (
		<EthersContext.Provider
			value={{
				address: address!,
				provider: web3Provider!,
				disconnect: disconnect,
				connect: connect,
				chainId: chainId!,
				loading: loading,
			}}
		>
			{children}
		</EthersContext.Provider>
	);
};

export default EthersContext;
