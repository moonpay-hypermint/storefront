import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { ContractContext } from '../../../context/ContractContext';
import { WalletContext } from '../../../context/WalletContext';
import ConnectWalletButton from '../../Wallet/ConnectWalletButton/ConnectWalletButton';
import styles from './PrivateSaleCard.module.scss';

const PrivateSaleCard: FC = () => {
    const { connectedWallet, isConnected, disconnect, connect } = useContext(WalletContext);
    const { hyperMintContract, nftContract } = useContext(ContractContext);
    const [isOnEarlyAccessList, setIsOnEarlyAccessList] = useState(false);

    const canAccessPrivateSale = useMemo(() => isConnected && isOnEarlyAccessList, [isConnected, isOnEarlyAccessList]);
    const cantAccessPrivateSale = useMemo(() => isConnected && !isOnEarlyAccessList, [isConnected, isOnEarlyAccessList]);

    const contractHasWhitelists = useMemo(() => {
        return (nftContract?.whitelists.length ?? 0) > 0;
    }, [nftContract?.whitelists]);

    const getWalletAllocation = async (walletAddress?: string) => {
        if (!walletAddress) {
            setIsOnEarlyAccessList(false);
            return;
        }

        const tokenAllocation = await hyperMintContract?.getTokenAllocation('0', walletAddress)
            .catch(() => {
                setIsOnEarlyAccessList(false);
            });

        if (tokenAllocation?.length) {
            setIsOnEarlyAccessList(true);
        }
    };

    useEffect(() => {
        if (isConnected && connectedWallet?.address) {
            getWalletAllocation(connectedWallet.address);
        }
    }, [isConnected, connectedWallet?.address]);

    if (canAccessPrivateSale) return null;

    if (cantAccessPrivateSale && contractHasWhitelists) {
        return (
            <article className={styles.card}>
                <div className={styles.cardContentBlock}>
                    <h2 className={`${styles.cardContent} ${styles.cardHeader}`}>Oops that wallet is not on the access list</h2>
                    <p className={styles.cardContent}>Wallet {connectedWallet?.formattedAddress} does not appear to be on the access list for early access. Check back during the public sale or disconnect to try again.</p>
                </div>

                <ConnectWalletButton
                    canAccessPrivateSale={isOnEarlyAccessList}
                    onClick={() => disconnect && disconnect()}
                />
            </article>
        );
    }

    if ((nftContract?.whitelists.length ?? 0) > 0) {
        return (
            <article className={styles.card}>
                <div className={styles.cardContentBlock}>
                    <h2 className={`${styles.cardContent} ${styles.cardHeader}`}>The private sale is live</h2>
                    <p className={styles.cardContent}>All private access list members are now free to begin purchasing tokens according to their allocation.</p>
                </div>

                <ConnectWalletButton
                    canAccessPrivateSale={isOnEarlyAccessList}
                    onClick={() => connect && connect()}
                />
            </article>
        );
    }

    return null;
};

export default PrivateSaleCard;