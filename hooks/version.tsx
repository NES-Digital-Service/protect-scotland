import {useEffect, useState} from 'react';
import {getVersion, Version} from 'react-native-exposure-notification-service';

export function useVersion(): Version | undefined {
  const [version, setVersion] = useState<Version>();
  useEffect(() => {
    const getVer = async () => {
      const ver = await getVersion();
      setVersion(ver);
    };
    getVer();
  }, []);

  return version;
}
