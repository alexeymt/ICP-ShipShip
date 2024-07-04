import {GradientTypography} from '../../styles';
import {useStore} from '../../hooks';
import {useEffect, useState} from 'react';
import {Principal} from "@dfinity/principal";


export const Version = () => {
    const {weddingActor, ledgerActor, weddingCanisterId} = useStore();
    const [backendVersion, setBackendVersion] = useState('');
    const [mintResult, setMintResult] = useState('');

    useEffect(() => {
        async function getBackendVersion() {
            await weddingActor.getAppVersion()
                .then(x => setBackendVersion(x));
            await ledgerActor.icrc2_approve({
                fee: [],
                memo: [],
                from_subaccount: [],
                created_at_time: [],
                amount: BigInt(30000),
                expected_allowance: [],
                expires_at: [],
                spender: {
                    // bob
                    owner: Principal.fromText(weddingCanisterId),
                    subaccount: []
                }
            })
              .then(x => console.log(`icrc2_approve executed! result: ${JSON.stringify(x)}`))
            await weddingActor.testPay()
              .then(x => console.log("paid!"))
        }
        getBackendVersion();
    }, []);

    return (
        <div>
            <GradientTypography variant="h1">Backend: {backendVersion}, mintResult: {mintResult}</GradientTypography>
        </div>
    );
};
