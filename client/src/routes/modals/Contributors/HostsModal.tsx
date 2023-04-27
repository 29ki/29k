import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import SheetModal from '../../../lib/components/Modals/SheetModal';
import {BottomSafeArea, Spacer8} from '../../../lib/components/Spacers/Spacer';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import {BottomGradient} from './components/BottomGradient';
import {Header} from './components/Header';
import {ScrollView} from './components/ScrollView';
import {ContributorsList} from './components/ContributorsList';
import {getPublicHosts} from '../../../lib/user/api/user';
import {User} from '../../../../../shared/src/schemas/User';

import {
  AppStackProps,
  ModalStackProps,
} from '../../../lib/navigation/constants/routes';
import {SPACINGS} from '../../../lib/constants/spacings';
import {ActivityIndicator} from 'react-native';
import {Contributor} from './components/Contributor';

const Wrapper = styled.View({
  flex: 1,
});

const Spinner = styled(ActivityIndicator)({
  marginRight: -SPACINGS.EIGHT,
  marginLeft: SPACINGS.EIGHT,
  marginTop: SPACINGS.EIGHT,
});

const Profile: React.FC<{host: User}> = ({host}) => {
  const {navigate, popToTop} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();

  const contributor = useMemo<Contributor>(
    () => ({
      name: host.displayName ?? '',
      avatar_url: host.photoURL,
      contributions: [],
    }),
    [host],
  );

  const onPress = useCallback(() => {
    popToTop();
    navigate('HostInfoModal', {host});
  }, [navigate, popToTop, host]);

  return <Contributor contributor={contributor} onPress={onPress} />;
};

const HostsModal = () => {
  const {t} = useTranslation('Modal.Hosts');
  const [isLoading, setIsLoading] = useState(false);
  const [hosts, setHosts] = useState<Array<User>>([]);

  useEffect(() => {
    setIsLoading(true);
    getPublicHosts()
      .then(setHosts)
      .finally(() => setIsLoading(false));
  }, [setIsLoading]);

  return (
    <SheetModal>
      <Wrapper>
        <Header>
          <ModalHeading>{t('title')}</ModalHeading>
          <Spacer8 />
          <Body16>{t('text')}</Body16>
        </Header>

        <ScrollView>
          {isLoading ? (
            <Spinner />
          ) : (
            <ContributorsList>
              {hosts.map(host => (
                <Profile host={host} key={host.uid} />
              ))}
            </ContributorsList>
          )}
          <BottomSafeArea />
        </ScrollView>

        <BottomGradient />
      </Wrapper>
    </SheetModal>
  );
};

export default HostsModal;
