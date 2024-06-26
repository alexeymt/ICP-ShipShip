import {GradientTypography} from '../../styles';
import {useStore} from '../../hooks';
import {useEffect, useState} from 'react';


export const Version = () => {
    const {weddingActor, nftActor, principal} = useStore();
    const [backendVersion, setBackendVersion] = useState('');
    const [mintResult, setMintResult] = useState('');

    useEffect(() => {
        async function getBackendVersion() {
            await weddingActor.getAppVersion()
                .then(x => setBackendVersion(x));
            await nftActor.mintDip721(principal, [], [])
                .then(x => {
                    if (x.hasOwnProperty('Ok')) {
                        let tokenId = x['Ok'].token_id;
                        console.log("setting tokenId: " + tokenId)
                        weddingActor.setRing("${tokenId}", principal)
                    }
                    weddingActor.setRing("foo bar test", principal)
                    setMintResult(JSON.stringify(x))
                    console.log("name: " + JSON.stringify(x))
                });
        }

        getBackendVersion();
    }, []);

    return (
        <div>
            <GradientTypography variant="h1">Backend: {backendVersion}, mintResult: {mintResult}</GradientTypography>
        </div>
    );
};
