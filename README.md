# Submission to 2023 Solana HyperDrive

Sync Studios has a highly experienced Mobile Gaming Team with over a Billion Career Downloads. We have built a simple solution that turns web2 player mobile player accounts in games into a tradable asset class.

### Sync Studio Solution Walkthrough

[![YouTube Video](https://img.youtube.com/vi/hPR8BOLHna4/0.jpg)](https://youtu.be/hPR8BOLHna4)

In web2, there is a billion-dollar black market trading in skins and in-game items. Several web2 marketplaces have emerged in an attempt to legitimize this space. However, there are still three key problems:

1. **Risks for Buyers**: As a buyer, you can still get "rugged" by a seller. You buy the account, but the original seller can reclaim their account from the developer, and the buyer loses everything.

2. **Dependency on Game Developers**: Both buyers and sellers are at the mercy of game developers who can revoke access to these items at any time.

3. **Exclusion of Developers**: Developers are often cut out of these transactions, leading to bans on sales outside of their games.

**Sync Studios' Solution**:
We have developed a solution to address these issues, benefiting both developers and gamers. Gamers can easily sell their accounts and progression, all validated by the blockchain, while developers can receive royalties from these transactions.

## Team:

- **Jon Hook** - CEO / Co-Founder - Gaming Industry Expert. Worked at Homa / BoomBit and AdColony. 1x Exit.
- **Serge Romanyuk** - Co-Founder - Senior Game Producer on some of the biggest casual games in history, such as Gardenscapes and Homescapes at Playrix.
- **Y.M Zhang** - Lead Blockchain Dev - Built major DEXs on NEAR protocol and created Web3 gaming SDKs that have created over 500k Web3 wallets.
- **Nattalia Ivanova** - Artist - Worked at multiple game studios, including Peak Games, and is incredibly talented.

## Extra Business Model for Mobile Games:

- **Gamers - Earn from Trading**: Gamers can earn from selling their accounts and can seamlessly trade. They can grind in-game or trade within the in-game marketplace.
- **Developers - Not Just Ads and IAPs**: This opens up a significant additional monetization opportunity for game studios. A percentage of all secondary trading will go to the development studio. A similar case study by NFT Rivals has shown increased KPIs in games, such as increased ad and IAP consumption.
- **For Sync**: SAAS model - cost per NFT minted by the game studio. Additionally, a small percentage of all secondary royalties and trading fees.

![Screenshot](https://i.ibb.co/Ltb6XN0/screenshot-2023-10-15-at-10-18-09.png)

#### Resources

- [Pitch deck](https://docs.google.com/presentation/d/1nGRIPEUTpERnzE5WNn95bWHq73vU1VmCBo0sCPD525I/edit?usp=sharing)
- [Android APK Download] - in submission
- [Sync HomePage](https://sync.studio/)
- [Sync Twitter](https://twitter.com/SyncStudio_)

#### Summary of Submission Features

- Game DEMO
- Conceptional Implementation API endpoints
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

![UserFlow](Pending)

#### Present Limitations/Known Issues

- Some features currently disabled on devnet:
  - Friend Investing System
  - Fiat payment for listing purchases
  - API endpoint are more strightforward approach compare to live version

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
