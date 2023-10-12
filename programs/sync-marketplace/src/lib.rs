use anchor_lang::prelude::*;
use anchor_spl::token;
use anchor_spl::token::{Approve, Mint, Token, TokenAccount, Transfer};
declare_id!("HeSVF4eHVcaFRMzbTwAz1wrtSv66xFp6V6cHKRNAtCG4");

#[program]
pub mod marketplace {
    use anchor_spl::token::{ApproveChecked, TransferChecked};

    use super::*;

    pub fn initialize(ctx: Context<Initialize>, fee: u64) -> Result<()> {
        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.marketplace_authority = *ctx.accounts.marketplace_authority.key;
        marketplace.fee = fee;
        marketplace.bump = ctx.bumps.get("marketplace_authority").unwrap().clone();

        Ok(())
    }

    pub fn list_nft(ctx: Context<ListNft>, price: u64) -> Result<()> {
        //transform pubkey to AccountInfo

        //NFT approval to allow transfer by marketplace
        let cpi_accounts = ApproveChecked {
            to: ctx.accounts.nft_token_account.to_account_info(),
            mint: ctx.accounts.nft_mint.to_account_info(),
            delegate: ctx.accounts.marketplace_authority.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::approve_checked(cpi_ctx, 1, 0)?;

        let listing = &mut ctx.accounts.listing;
        listing.owner = *ctx.accounts.owner.key;
        listing.price = price;
        listing.nft_mint = *ctx.accounts.nft_mint.to_account_info().key;

        let marketplace = &mut ctx.accounts.marketplace;
        marketplace
            .listings
            .push(*ctx.accounts.listing.to_account_info().key);

        let owner_listings = &mut ctx.accounts.owner_listings;
        owner_listings
            .listings
            .push(*ctx.accounts.listing.to_account_info().key);

        Ok(())
    }

    pub fn purchase_nft(ctx: Context<PurchaseNft>) -> Result<()> {
        let seller_pubkey = ctx.accounts.seller.key;

        if *seller_pubkey != ctx.accounts.listing.owner {
            return Err(ErrorCode::WrongSeller.into());
        }

        let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
            ctx.accounts.buyer.key,
            &ctx.accounts.seller.key,
            ctx.accounts.listing.price,
        );
        //fetch account info for owner

        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.buyer.clone(),
                ctx.accounts.seller.clone(),
                ctx.accounts.system_program.clone().to_account_info(),
            ],
        )?;

        //create pda for nft token account for buyer

        //transfer nft
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.nft_token_account.to_account_info(),
            mint: ctx.accounts.nft_mint.to_account_info(),
            to: ctx.accounts.buyer_token_account.to_account_info(),
            authority: ctx.accounts.marketplace_authority.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        //seeds=[b"authority".as_ref(),marketplace.key().as_ref()]
        let marketplace_key = ctx.accounts.marketplace.key();
        let bump = ctx.accounts.marketplace.bump;

        let seeds = &[b"authority".as_ref(), marketplace_key.as_ref(), &[bump]];
        let binding = &[&seeds[..]];
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts).with_signer(binding);
        token::transfer_checked(cpi_ctx, 1, 0)?;

        Ok(())
    }

    pub fn remove_listing(ctx: Context<RemoveListing>) -> Result<()> {
        let marketplace = &mut ctx.accounts.listings;
        // Remove the listing
        //find pda address
        let pda = Pubkey::find_program_address(
            &[
                b"listing_pda".as_ref(),
                marketplace.key().as_ref(),
                ctx.accounts.owner.key().as_ref(),
                ctx.accounts.nft_token_account.key().as_ref(),
            ],
            ctx.program_id,
        );

        //delete listing
        let idx = marketplace
            .listings
            .iter()
            .position(|&r| r == pda.0)
            .unwrap();
        marketplace.listings.swap_remove(idx);

        //delete owner listing
        let owner_listings = &mut ctx.accounts.owner_listings;
        let idx = owner_listings
            .listings
            .iter()
            .position(|&r| r == pda.0)
            .unwrap();
        owner_listings.listings.swap_remove(idx);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init,payer=signer, space = 10_240)]
    /// CHECK:
    pub marketplace: Account<'info, Marketplace>,
    #[account(init, seeds=[b"authority".as_ref(),marketplace.key().as_ref()],bump, payer = signer, space = 8 + 8)]
    /// CHECK:
    pub marketplace_authority: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK:
    pub signer: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ListNft<'info> {
    #[account(mut)]
    pub marketplace: Account<'info, Marketplace>,
    /// CHECK:
    #[account(init, seeds=[b"listing_pda".as_ref(),marketplace.key().as_ref(),owner.key().as_ref(),nft_mint.key().as_ref()],bump, payer = fee_payer, space = 4+ 8 +64+128)]
    pub listing: Account<'info, Listing>,
    /// CHECK:
    #[account(mut)]
    marketplace_authority: AccountInfo<'info>,
    /// CHECK:
    #[account(init_if_needed,seeds=[b"owner_listings".as_ref(),marketplace.key().as_ref(),owner.key().as_ref()],bump, payer = fee_payer, space = 4 + 10_000)]
    pub owner_listings: Account<'info, OwnerListings>,
    /// CHECK:
    #[account(mut)]
    pub nft_token_account: UncheckedAccount<'info>,
    /// CHECK:
    #[account(mut)]
    pub nft_mint: UncheckedAccount<'info>,
    /// CHECK:
    #[account(mut)]
    pub owner: Signer<'info>,

    /// CHECK:
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PurchaseNft<'info> {
    #[account(mut)]
    pub listing: Account<'info, Listing>,

    #[account(mut)]
    /// CHECK:
    pub marketplace: Account<'info, Marketplace>,

    #[account(mut)]
    /// CHECK:
    pub nft_token_account: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK:
    pub nft_mint: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK:
    pub marketplace_authority: UncheckedAccount<'info>,
    #[account(mut, signer)]
    /// CHECK:
    pub buyer: AccountInfo<'info>,
    /// CHECK:
    #[account(mut)]
    pub buyer_token_account: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK:
    pub seller: AccountInfo<'info>,

    /// CHECK:
    #[account(mut)]
    pub fee_payer: UncheckedAccount<'info>,

    // Include buyer and NFT accounts here
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RemoveListing<'info> {
    #[account(mut)]
    pub listings: Account<'info, Marketplace>,
    /// CHECK:
    #[account(mut)]
    pub nft_token_account: UncheckedAccount<'info>,
    #[account(mut)]
    pub owner_listings: Account<'info, OwnerListings>,
    #[account(mut)]
    /// CHECK:
    pub owner: AccountInfo<'info>,

    /// CHECK:
    #[account(mut)]
    pub fee_payer: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Marketplace {
    //doesnt nessarily need to be a vec, would be better to use indexer in production
    pub listings: Vec<Pubkey>,
    pub marketplace_authority: Pubkey,
    pub fee: u64,
    pub bump: u8,
}
#[account]
pub struct Listing {
    pub owner: Pubkey,
    pub nft_mint: Pubkey,
    pub price: u64,
}

#[account]
pub struct OwnerListings {
    pub listings: Vec<Pubkey>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Wrong seller")]
    WrongSeller = 100,
}
