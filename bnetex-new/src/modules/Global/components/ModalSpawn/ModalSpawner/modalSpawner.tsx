import { useModalSpawner } from 'lib/hooks/useModal';

const ModalSpawner = () => {
    const {activeModal} = useModalSpawner();
    return activeModal;
};

export default ModalSpawner;
