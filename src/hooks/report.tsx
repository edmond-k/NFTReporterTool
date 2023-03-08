import Reporter from "../chain-info/contracts/NFTInfo.json"
import { utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import { useContractFunction } from "@usedapp/core"

export const Reports = () => {
    const {abi} = Reporter


    const contractAddress = "0x6D199189248896293EC488684eDB667fd83770C8"

    const reporterInterface = new utils.Interface(abi)
    const reporterContract = new Contract(contractAddress, reporterInterface)

    const {send: transact, state: transactState} = useContractFunction(
        reporterContract, "addNFTInfo", {transactionName: "makeReport"}
    )

    const makeReport = (ctAddress: string, tokenId: number) => {
        const amount = 0.02
        const amountAsString = amount.toString()
        transact(ctAddress, tokenId, {value: utils.parseEther(amountAsString)})
    }

    return {makeReport, transactState}
}
