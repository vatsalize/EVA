import React from 'react';
import { DemoAccountModal } from './DemoAccountModal';

export function DemoStudentModal({ isOpen, onClose, onSelectStudent }) {
  return (
    <DemoAccountModal
      isOpen={isOpen}
      onClose={onClose}
      type="student"
      onSelectAccount={onSelectStudent}
    />
  );
}
