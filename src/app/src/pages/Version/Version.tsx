import {GradientTypography} from '../../styles';
import {useStore} from '../../hooks';
import {useEffect, useState} from 'react';


export const Version = () => {
    const {weddingActor, principal} = useStore();
    const [backendVersion, setBackendVersion] = useState('');
    const [mintResult, setMintResult] = useState('');

    useEffect(() => {
        async function getBackendVersion() {
            await weddingActor.getAppVersion()
                .then(x => setBackendVersion(x));
            await weddingActor.mintNft("some text", principal)
                .then(_ => console.log("NFT minted"))
        }
        getBackendVersion();
    }, []);

    return (
        <div>
            <GradientTypography variant="h1">Backend: {backendVersion}, mintResult: {mintResult}</GradientTypography>
        </div>
    );
};
