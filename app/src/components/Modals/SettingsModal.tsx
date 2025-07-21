import { Modal, ModalOverlay, ModalHeader, ModalBody, ModalContent, Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { t } = useTranslation();

    const handleSelectMode = (event: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(event.target.value);
    };

    const selectedMode = i18n.language;

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent bg={'#0A0A0A'} borderWidth={'4px'} borderColor={'#85ECFA'} borderRadius={'2xl'}>
                <ModalHeader className="text-[#85ECFA] text-center">
                    {t('settings')}
                </ModalHeader>
                <ModalBody>
                    <p className='mb-4 text-white'>{t('language')}</p>
                    <Select
                        className='content'
                        borderColor={'#93c5fd'}
                        borderWidth={'4px'}
                        width={'10rem'}
                        marginBottom={4}
                        color={'white'}
                        bg='transparent' size='md'
                        onChange={handleSelectMode}
                        value={selectedMode}
                    >
                        <option className='text-black' value={'en'}>English</option>
                        <option className='text-black' value={'pl'}>Polski</option>
                        <option className='text-black' value={'ru'}>Русский</option>
                        <option className='text-black' value={'es'}>Español</option>
                    </Select>

                </ModalBody>
            </ModalContent>
        </Modal>
    );
}