import React from 'react';
import { DemoAccountModal } from './DemoAccountModal';

export function DemoCoordinatorModal({ isOpen, onClose, onSelectCoordinator }) {
  return (
    <DemoAccountModal
      isOpen={isOpen}
      onClose={onClose}
      type="coordinator"
      onSelectAccount={onSelectCoordinator}
    />
  );
}
