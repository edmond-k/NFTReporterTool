import Reporter from "../chain-info/contracts/NFTInfo.json"
import { utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import { useContractFunction } from "@usedapp/core"

export const SendClaimRemoval = () => {
    const {abi} = Reporter


    const contractAddress = "0x6D199189248896293EC488684eDB667fd83770C8"

    const reporterInterface = new utils.Interface(abi)
    const reporterContract = new Contract(contractAddress, reporterInterface)

    const {send: removal, state: removalState} = useContractFunction(
        reporterContract, "removeClaim", {transactionName: "removeReport"}
    )

    const removeReported = (contractAddress: string, tokenId: number) => {
        removal(contractAddress, tokenId)
    }

    return {removeReported, removalState}
}