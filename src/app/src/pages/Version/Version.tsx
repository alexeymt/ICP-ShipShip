import {GradientTypography} from '../../styles';
import {useStore} from '../../hooks';
import {useEffect, useState} from 'react';

export const Version = () => {
    const {weddingActor} = useStore();
    const [backendVersion, setBackendVersion] = useState('');

    useEffect(() => {
        async function getBackendVersion() {
            const version = await weddingActor.getAppVersion();
            setBackendVersion(version);
        }

        getBackendVersion();
    }, []);

    return (
        <div>
            <GradientTypography variant="h1">Backend: {backendVersion}</GradientTypography>
        </div>
    );
};