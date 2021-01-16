/* eslint-disable camelcase */
import React from "react";
import { NewFlagModal } from "./new-flag-modal";
import { useUpsertFlag } from "../flag-details/hooks/use-upsert-flag";

export const NewFlagController: React.FC = () => {
  const { upsertFlag } = useUpsertFlag();
  return <NewFlagModal action={upsertFlag} />;
};
