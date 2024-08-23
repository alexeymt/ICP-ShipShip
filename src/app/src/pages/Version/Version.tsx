import {GradientTypography} from '../../styles';
import {useStore} from '../../hooks';
import {useEffect, useState} from 'react';


export const Version = () => {
    const {beneficiaryPrincipalId, principal, weddingActor, ledgerActor, weddingCanisterId} = useStore();
    const [backendVersion, setBackendVersion] = useState('');
    const [mintResult, setMintResult] = useState('');

    useEffect(() => {
        async function getBackendVersion() {
            await weddingActor.getAppVersion()
                .then(x => setBackendVersion(x));
            console.log(beneficiaryPrincipalId);
            const balance = await ledgerActor?.icrc1_balance_of({
                owner: principal,
                subaccount: [],
            });
            console.log(balance);
        }
        getBackendVersion();
    }, []);

    return (
        <div>
            <GradientTypography variant="h1">Backend: {backendVersion}, mintResult: {mintResult}</GradientTypography>
        </div>
    );
};
