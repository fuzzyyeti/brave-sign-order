import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import React from "react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import { PublicKey, SystemProgram, Keypair, Transaction } from "@solana/web3.js";

export const App = () => {
  const {publicKey,  signTransaction} = useWallet()
  const {connection} = useConnection()

// WARNING: DO not put any SOL on this address!
	const localWallet = Keypair.fromSecretKey(Uint8Array.from( [126,155,162,49,38,115,138,180,12,174,106,226,236,143,132,223,38,85,213,66,117,191,8,10,143,7,9,37,95,104,121,233,76,160,193,46,115,148,3,238,73,83,137,49,131,93,87,110,77,217,184,148,231,229,142,170,145,95,68,170,255,244,152,113]))


	const makeTransaction = () => {

		const t = new Transaction()
		const sendLocal = SystemProgram.transfer({
			fromPubkey: localWallet.publicKey,
			toPubkey: new PublicKey('A3a3ocqtWdguCaEYjYEV8p2CnpWrga29ZJaoXWUkdQYH'),
			lamports: 1000	
		})
		const sendPayer =  SystemProgram.transfer({
			fromPubkey: publicKey!,
			toPubkey: new PublicKey('A3a3ocqtWdguCaEYjYEV8p2CnpWrga29ZJaoXWUkdQYH'),
			lamports: 1000
		})
		t.add(sendLocal).add(sendPayer)
		return t
	}

	const partialSignFirst = async () => {
		const t = makeTransaction()
		const rbh = await connection.getRecentBlockhash("confirmed")
		t.recentBlockhash = rbh.blockhash
		t.feePayer = publicKey!
		console.log("Local keypair is signing")
		t.partialSign(localWallet)
		console.log(`The signature for ${(t.signatures[0]?.publicKey?.toBase58())} is ${t.signatures[0]?.signature === null ? " null" : " not null"}`)
		console.log(`The signature for ${(t.signatures[1]?.publicKey?.toBase58())} is ${t.signatures[1]?.signature === null ? " null" : " not null"}`)
		console.log("Connected wallet is signing")
		const signedByWallet = await signTransaction!(t) 
		console.log(`The signature for ${(signedByWallet.signatures[0]?.publicKey?.toBase58())} is ${signedByWallet.signatures[0]?.signature === null ? " null" : " not null"}`)
		console.log(`The signature for ${(signedByWallet.signatures[1]?.publicKey?.toBase58())} is ${signedByWallet.signatures[1]?.signature === null ? " null" : " not null"}`)
	}
	const walletSignFirst = async () => {
		const t = makeTransaction()
		const rbh = await connection.getRecentBlockhash("confirmed")
		t.recentBlockhash = rbh.blockhash
		t.feePayer = publicKey!
		console.log("Connected wallet is signing")
		const signedByWallet = await signTransaction!(t) 
		console.log(`The signature for ${(signedByWallet.signatures[0]?.publicKey?.toBase58())} is ${signedByWallet.signatures[0]?.signature === null ? " null" : " not null"}`)
		console.log(`The signature for ${(signedByWallet.signatures[1]?.publicKey?.toBase58())} is ${signedByWallet.signatures[1]?.signature === null ? " null" : " not null"}`)
		console.log("Local keypair is signing")
		signedByWallet.partialSign(localWallet)
		console.log(`The signature for ${(signedByWallet.signatures[0]?.publicKey?.toBase58())} is ${signedByWallet.signatures[0]?.signature === null ? " null" : " not null"}`)
		console.log(`The signature for ${(signedByWallet.signatures[1]?.publicKey?.toBase58())} is ${signedByWallet.signatures[1]?.signature === null ? " null" : " not null"}`)
	}

  return (
    <>
			<AppBar position={"static"}>
				<Toolbar>
				<Box flexGrow={1} />
				<WalletMultiButton />
				</Toolbar>
			</AppBar>
      <Typography variant={"body1"}>Wallet address = {publicKey?.toBase58()} </Typography>
			<Button onClick={walletSignFirst}>Wallet First</Button>
			<Button onClick={partialSignFirst}>Other Key First</Button>
    </>

  )
}
