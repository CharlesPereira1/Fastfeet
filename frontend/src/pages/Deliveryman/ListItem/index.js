import React from 'react';
import { MdEdit, MdDeleteForever } from 'react-icons/md';
import { toast } from 'react-toastify';

import PropTypes from 'prop-types';

import Action from '~/components/ActionPopUp';
import PhotoName from '~/components/PhotoName';
import api from '~/services/api';
import history from '~/services/history';
import { colors } from '~/styles/colors';

import { Container, ActionContainer } from './styles';

const name = 'Charles Pereira';
export default function DeliverymanItem() {
  return (
    <Container>
      <small>#01</small>
      <PhotoName name={name} />
      <small>Charles Pereira</small>
      <small>charles@teste.com</small>
      <Action>
        <ActionContainer>
          <div>
            <button type="button">
              <MdEdit color={colors.info} size={15} />
              <span>Editar</span>
            </button>
          </div>

          <div>
            <button type="button">
              <MdDeleteForever color={colors.danger} size={15} />
              <span>Excluir</span>
            </button>
          </div>
        </ActionContainer>
      </Action>
    </Container>
  );
}

DeliverymanItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }),
  }).isRequired,
  // updateDeliverymen: PropTypes.func.isRequired,
};
