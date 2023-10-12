# Sync

_Mass web2 game adoption_. **Sync** is a solution for game developers to integrate their games with the Solana blockchain.

Submission to 2023 Solana HyperDrive Submission by:

- Jon
- Hugo
- Benny
  ...more
- Eric ([GitHub](https://github.com/ymc182), [LinkedIn](https://www.linkedin.com/in/yiu-ming-cheung-8b150a147/))

#### Resources

- [Pitch Deck](#)
- [Android APK Download](#)
- [Sync HomePage](#)
- [Sync Twitter](#)

#### Summary of Submission Features

- Game DEMO
- Web2 Game Compatable Marketplace API
- Web2 Game Users OnRamp API
- Feeless peer-to-peer Listing
- Parsed Solana Metadata Store for Games
- Live on Solana Devnet
- Live on Android

#### Tech Stack

- Anchor: [Marketplace program](./programs/sync-marketplace/) Manage game progress listing and store listing PDAs
- Anchor: [Collection NFT](./programs/sync-nft) Customise NFT program for easy integration for any game
  - TypeScript: [Main API](./app/src/app/api/) Centerpiece for games interacting with the Solana blockchain
- Web3 Auth SDK: Single sign-in with Google and non-custodial signing wallet
- Solana Unity SDK: Integration Solana Wallet Connect with Unity games
- Unity: [Mobile Game]()
- NextJs: [Marketplace / API Dashboard Interface](./backend/src/circle/)
- Postgresql/Prisma: [Database](./app/prisma/) for storing indexed data, listing, and game data, also act as a cache for Solana blockchain data and metadata provider

#### Detailed User Flow

**Games Integration**

**User Creation**

- Users deposit funds to their account a credit card using the Circle payments API
- Currently, devnet assigns a random credit card to the user (manual credit card entry is disabled)
- On confirmation of payment, funds are transferred from tap account to users USDC token account
- Balance is updated on users homepage and the transaction on recent activity (custom parsed Solana transaction history)

**Trading**

- Users can initiate a peer to peer transfer via the "Send" button on the home page.
- Users query other tap members via a search that looks up other members by email via our Google Backend.
- Users select a user and amount and send the transaction to our backend.
- The program transfer function requires 3 signatures: the Program, the tap Bank authority, and the user.
- Once the transaction is confirmed on chain, balance and transfer are updated on the user homepage.

![UserFlow](Pending)

# API Details and Documentation

...(work in progress)

#### Present Limitations/Known Issues

- Some features currently disabled on devnet:
  - Friend Investing System
  - Fiat payment for listing purchases
  - (more)

---

# Sync API Local Development

To deploy Sync API locally, you will need to set up the following:

- Anchor (isntallation instructions [here](https://www.anchor-lang.com/docs/installation))
-

## API / Frontend setup

- Install Node.js LTS [here](https://nodejs.org/en/download/)

### Install Dependencies

- run `npm install` in the `app` directory

### Set up Environment

- run `npm run dev` in the `app` directory

Follow these directions https://reactnative.dev/docs/environment-setup but skip Creating a new application.

In a terminal in the project directory run `npm install`

### Set up Environment

- Set environment variables, `MARKETPLACE_PROGRAM_ID`, `MINTER_PROGRAM_ID`,`MARKETPLACE_ADDRESS`, `MARKETPLACE_AUTHORITY`.
- Set `DATABASE_URL` to the address of the local or remote database.
- Set `SECRET_KEY` for server wallet operations.

### Test the programs

You must have run the setup steps already.

- To Start Solana Validator with Metaplex and Anchor programs: you will need [@metaplex/js](https://github.com/metaplex-foundation/js), clone the repo and run `yarn` && `yarn amman:start` in the repo root directory.

- Set the url to the local validator in the `.env` file.
- run `anchor test` in the sync app `root` directory

### Program Info

- MARKETPLACE: `HeSVF4eHVcaFRMzbTwAz1wrtSv66xFp6V6cHKRNAtCG4`
- SYNC-NFT: `Lp7MMp1TTgz6PVVNHySHgGuZQGmxTo6QtZkb5mz6VJF`
