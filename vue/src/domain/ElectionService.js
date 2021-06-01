import { Election } from "../../../src";
import Web3 from "./web3";
import moment from "moment";

class ElectionService {
	createContract = async () => {
		const web3 = await Web3();
		if (!web3)
			return undefined;
		const accounts = await web3.eth.getAccounts();
		const networkId
		const contract = await new web3.eth.Contract(JSON.parse(Election.abi), )
	}
}
