import React from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { toast } from 'react-toastify';

import PropTypes from 'prop-types';

import ActionPopUp from '~/components/ActionPopUp';
import Modal from '~/components/Modal/Modal';
import api from '~/services/api';
import { colors } from '~/styles/colors';

import { Container, ActionContainer, ModalContainer } from './styles';

export default function ProblemItem({ data, updateProblems }) {
  async function handleCancel() {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm(
      'Você tem certeza que deseja cancelar a encomenda?'
    );

    if (!confirm) {
      toast.error('Encomenda não cancelada!');
      return;
    }

    try {
      await api.delete(`/problem/${data.delivery_id}/cancel-delivery`);
      updateProblems();
      toast.success('Encomenda cancelada com sucesso.');
    } catch (err) {
      toast.error('Essa encomenda não pode ser cancelada!');
    }
  }

  return (
    <Container>
      <small>#{data.delivery_id}</small>
      <small>{data.description}</small>
      <ActionPopUp contentStyle={{ width: '200px', borderRadius: '4px' }}>
        <ActionContainer>
          <div>
            <Modal>
              <ModalContainer>
                <strong>VISUALIZAR PROBLEMA</strong>
                <p>{data.description}</p>
              </ModalContainer>
            </Modal>
          </div>

          <div>
            <button onClick={handleCancel} type="button">
              <MdDeleteForever color={colors.danger} size={15} />
              <span>Cancelar encomenda</span>
            </button>
          </div>
        </ActionContainer>
      </ActionPopUp>
    </Container>
  );
}

ProblemItem.propTypes = {
  data: PropTypes.shape({
    delivery_id: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  updateProblems: PropTypes.func.isRequired,
};
