import RequestDetailModal from "./RequestDetailModal";
import RequestActionModal from "./RequestActionModal";
import { Request } from "./RequestDetailModal";


export type ModalType = "detail" | "action" | null;

interface ModalManagerProps {
    modalType: ModalType;
    request: Request | null;
    onClose: () => void;
  }

const ModalManager = ({ modalType, request, onClose }: ModalManagerProps) => {
  if (!modalType || request === null) return null;

  if (modalType === "detail") {
    return (
      <RequestDetailModal
        request={request}
        onClose={onClose}
        setModalMode={() => {}}
        setSelectedRequestId={() => {}}
        setModalOpen={() => {}}
        isOpen={true}
      />
    );
  }

  if (modalType === "action") {
    return (
      <RequestActionModal
        request={request.id}
        onClose={onClose}
        open={true}
        mode="reassign"
        onSubmit={() => {}}
      />
    );
  }

  return null;
};

export default ModalManager;
