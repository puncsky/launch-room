import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import { NewFlagForm } from "@/shared/feature-flags/new-flag-form";
import { UpsertFlagVariables } from "../flag-details/data/__generated__/UpsertFlag";

type Props = {
  action: (variables: UpsertFlagVariables) => Promise<void>;
  newFlagLabel: string;
};

export const NewFlagModal: React.FC<Props> = ({ action, newFlagLabel }) => {
  const [visible, setVisible] = useState(false);
  const close = () => setVisible(false);
  const open = () => setVisible(true);
  return (
    <>
      <Button onClick={open}>{newFlagLabel}</Button>
      <Modal visible={visible} footer={null} onCancel={close}>
        <NewFlagForm upsertFlag={action} closeModal={close} />
      </Modal>
    </>
  );
};
