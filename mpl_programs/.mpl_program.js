const path = require("path");

function localDeployPath(programName) {
	return path.join(__dirname, "mpl_programs", `${programName}.so`);
}

const programs = [
	{
		label: "Token Metadata",
		programId: mplTokenMetadata.PROGRAM_ADDRESS,
		deployPath: localDeployPath("mpl_token_metadata"),
	},
	{
		label: "Candy Machine V2",
		programId: mplCandyMachine.PROGRAM_ADDRESS,
		deployPath: localDeployPath("mpl_candy_machine"),
	},
	{
		label: "Auction House",
		programId: mplAuctionHouse.PROGRAM_ADDRESS,
		deployPath: localDeployPath("mpl_auction_house"),
	},
	{
		label: "Candy Machine V3",
		programId: mplCandyMachineCore.PROGRAM_ADDRESS,
		deployPath: localDeployPath("mpl_candy_machine_core"),
	},
	{
		label: "Candy Guard",
		programId: mplCandyGuard.PROGRAM_ADDRESS,
		deployPath: localDeployPath("mpl_candy_guard"),
	},
	{
		label: "Gateway",
		programId: "gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs",
		deployPath: localDeployPath("solana_gateway_program"),
	},
	{
		label: "Token Auth Rules",
		programId: "auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg",
		deployPath: localDeployPath("mpl_token_auth_rules"),
	},
];
